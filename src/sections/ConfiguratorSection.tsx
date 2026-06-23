import { useState, useCallback, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SectionHeader from '@/components/SectionHeader';
import StepIndicator from '@/components/StepIndicator';
import ConfiguratorItemCard from '@/components/ConfiguratorItemCard';
import OrderSummaryPanel from '@/components/OrderSummaryPanel';
import { useCatering } from '@/hooks/useCateringContext';
import { trpc } from '@/providers/trpc';
import { categoryLabels, categoryOrder, categoryImages, eventTypeOptions, serviceTypeOptions, LEAD_TIME_DAYS, DELIVERY_FEE } from '@/data/menu';
import type { ConfiguratorStep, SubmitStatus } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const minEventDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + LEAD_TIME_DAYS);
  return d.toISOString().split('T')[0];
};

const eventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  eventDate: z.string().min(1, 'Event date is required').refine((val) => {
    return val >= minEventDate();
  }, `We need at least ${LEAD_TIME_DAYS} days notice — please choose a later date`),
  eventType: z.string().min(1, 'Event type is required'),
  guestCount: z.string().min(1, 'Guest count is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function ConfiguratorSection() {
  const { selectedItems, updateQuantity, selectedItemsList, menuItems } = useCatering();
  const [currentStep, setCurrentStep] = useState<ConfiguratorStep>(1);
  const [eventDetails, setEventDetails] = useState<EventFormData | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [serviceType, setServiceType] = useState('');
  const stepContentRef = useRef<HTMLDivElement>(null);

  const submitEnquiry = trpc.catering.submit.useMutation({
    onSuccess: () => setSubmitStatus('success'),
    onError: () => setSubmitStatus('error'),
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const watchedServiceType = watch('serviceType', '');
  const isDelivery = watchedServiceType.startsWith('Delivery');

  const animateStepTransition = useCallback((direction: 'next' | 'back', callback: () => void) => {
    const el = stepContentRef.current;
    if (!el) { callback(); return; }
    const outX = direction === 'next' ? -30 : 30;
    const inX = direction === 'next' ? 30 : -30;
    gsap.to(el, {
      opacity: 0, x: outX, duration: 0.3, ease: 'power2.inOut',
      onComplete: () => {
        callback();
        gsap.fromTo(el, { opacity: 0, x: inX }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.05 });
      },
    });
  }, []);

  const goToStep = useCallback((step: ConfiguratorStep) => {
    if (step === 2 && selectedItemsList.length === 0) return;
    const direction = step > currentStep ? 'next' : 'back';
    animateStepTransition(direction, () => {
      setCurrentStep(step);
      const el = document.getElementById('catering');
      if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    });
  }, [currentStep, selectedItemsList.length, animateStepTransition]);

  const onEventFormSubmit = useCallback((data: EventFormData) => {
    setEventDetails(data);
    setServiceType(data.serviceType);
    goToStep(3);
  }, [goToStep]);

  const handleSubmitInquiry = useCallback(async () => {
    if (!eventDetails || selectedItemsList.length === 0) return;
    setSubmitStatus('submitting');
    const subtotal = selectedItemsList.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
    const deliveryFee = eventDetails.serviceType.startsWith('Delivery') ? DELIVERY_FEE : 0;
    submitEnquiry.mutate({
      customerName: eventDetails.name,
      customerEmail: eventDetails.email,
      customerPhone: eventDetails.phone,
      eventDate: eventDetails.eventDate,
      eventType: eventDetails.eventType,
      guestCount: Number(eventDetails.guestCount),
      serviceType: eventDetails.serviceType,
      deliveryAddress: eventDetails.deliveryAddress || null,
      notes: eventDetails.notes || null,
      items: selectedItemsList.map((i) => ({
        name: i.menuItem.name,
        quantity: i.quantity,
        price: i.menuItem.price,
        total: i.menuItem.price * i.quantity,
      })),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    });
  }, [eventDetails, selectedItemsList, submitEnquiry]);

  const getCategorySelectedCount = useCallback((category: string) => {
    return selectedItemsList.filter((item) => item.menuItem.category === category).length;
  }, [selectedItemsList]);

  useEffect(() => {
    if (currentStep === 2) {
      const fields = document.querySelectorAll('.form-field-reveal');
      gsap.fromTo(fields, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out', delay: 0.1 });
    }
  }, [currentStep]);

  const subtotal = selectedItemsList.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const deliveryFee = serviceType.startsWith('Delivery') ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return (
    <section id="catering" className="bg-charcoal py-20 md:py-[120px] px-6 md:px-10">
      <div className="max-w-[1100px] mx-auto">
        <SectionHeader
          label="CATERING"
          heading="Build Your Order"
          subtitle="Select your items, tell us about your event, and we'll get back to you within 24 hours."
          align="left"
        />

        <StepIndicator currentStep={currentStep} />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[65%]">
            <div ref={stepContentRef} className="min-h-[500px]">

              {/* STEP 1: Menu Selection */}
              {currentStep === 1 && (
                <div className="space-y-10">
                  {categoryOrder.map((category) => {
                    const items = menuItems.filter((item) => item.category === category);
                    const label = categoryLabels[category];
                    return (
                      <div key={category}>
                        <div className="relative w-full h-[120px] rounded-lg overflow-hidden mb-4">
                          <img src={categoryImages[category]} alt={label.title} className="w-full h-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/30 to-transparent" />
                          <div className="absolute bottom-3 left-4">
                            <span className="font-display text-xl text-cream">{label.title}</span>
                            {label.subtitle && (
                              <span className="font-body text-[0.6rem] uppercase tracking-[0.1em] text-ember ml-2">{label.subtitle}</span>
                            )}
                            {getCategorySelectedCount(category) > 0 && (
                              <span className="font-body text-[0.625rem] text-ember ml-2">{getCategorySelectedCount(category)} selected</span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-3">
                          {items.map((item) => (
                            <ConfiguratorItemCard
                              key={item.id}
                              item={item}
                              quantity={selectedItems.get(item.id) || 0}
                              onUpdateQuantity={updateQuantity}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* STEP 2: Event Details */}
              {currentStep === 2 && (
                <form onSubmit={handleSubmit(onEventFormSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="form-field-reveal">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Name *</label>
                      <input {...register('name')} placeholder="Your name" className="input-dark" />
                      {errors.name && <span className="text-burnt text-xs mt-1 block">{errors.name.message}</span>}
                    </div>

                    <div className="form-field-reveal">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Email *</label>
                      <input {...register('email')} type="email" placeholder="Email address" className="input-dark" />
                      {errors.email && <span className="text-burnt text-xs mt-1 block">{errors.email.message}</span>}
                    </div>

                    <div className="form-field-reveal">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Phone *</label>
                      <input {...register('phone')} type="tel" placeholder="Phone number" className="input-dark" />
                      {errors.phone && <span className="text-burnt text-xs mt-1 block">{errors.phone.message}</span>}
                    </div>

                    <div className="form-field-reveal">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">
                        Event Date * <span className="text-smoke/50 normal-case tracking-normal">({LEAD_TIME_DAYS} days min notice)</span>
                      </label>
                      <input {...register('eventDate')} type="date" min={minEventDate()} className="input-dark" />
                      {errors.eventDate && <span className="text-burnt text-xs mt-1 block">{errors.eventDate.message}</span>}
                    </div>

                    <div className="form-field-reveal">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Event Type *</label>
                      <select {...register('eventType')} className="input-dark">
                        <option value="">Select type</option>
                        {eventTypeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
                      </select>
                      {errors.eventType && <span className="text-burnt text-xs mt-1 block">{errors.eventType.message}</span>}
                    </div>

                    <div className="form-field-reveal">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Guest Count *</label>
                      <input {...register('guestCount')} type="number" min={1} placeholder="Number of guests" className="input-dark" />
                      {errors.guestCount && <span className="text-burnt text-xs mt-1 block">{errors.guestCount.message}</span>}
                    </div>

                    <div className="form-field-reveal md:col-span-2">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-3 block">Service Type *</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        {serviceTypeOptions.map((type) => (
                          <label key={type} className="flex items-center gap-3 cursor-pointer bg-charcoal-light border border-[rgba(196,148,58,0.1)] hover:border-ember rounded-lg px-4 py-3 transition-colors flex-1">
                            <input {...register('serviceType')} type="radio" value={type} className="sr-only peer" />
                            <div className="w-4 h-4 rounded-full border-2 border-[rgba(196,148,58,0.3)] peer-checked:border-ember peer-checked:bg-ember flex items-center justify-center transition-colors shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-charcoal opacity-0 peer-checked:opacity-100" />
                            </div>
                            <span className="font-body text-sm text-cream">{type}</span>
                          </label>
                        ))}
                      </div>
                      {errors.serviceType && <span className="text-burnt text-xs mt-1 block">{errors.serviceType.message}</span>}
                    </div>

                    {isDelivery && (
                      <div className="form-field-reveal md:col-span-2">
                        <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Delivery Address *</label>
                        <input {...register('deliveryAddress')} placeholder="Full delivery address, Hong Kong" className="input-dark" />
                      </div>
                    )}

                    <div className="form-field-reveal md:col-span-2">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">Notes</label>
                      <textarea {...register('notes')} rows={3} placeholder="Dietary requirements, setup notes, anything else..." className="input-dark resize-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-10">
                    <button type="button" onClick={() => goToStep(1)}
                      className="px-7 py-3 border border-[rgba(196,148,58,0.3)] text-smoke rounded font-body text-xs uppercase tracking-[0.1em] hover:border-ember hover:text-ember transition-colors cursor-pointer"
                    >Back</button>
                    <button type="submit"
                      className="px-8 py-3 bg-ember text-charcoal rounded font-body text-xs uppercase tracking-[0.1em] hover:bg-burnt transition-colors cursor-pointer"
                    >Review Order</button>
                  </div>
                </form>
              )}

              {/* STEP 3: Review & Submit */}
              {currentStep === 3 && (
                <div>
                  {submitStatus === 'success' ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-ember/20 flex items-center justify-center mx-auto mb-6">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C4943A" strokeWidth="2">
                          <polyline points="8,16 14,22 24,10" />
                        </svg>
                      </div>
                      <h3 className="font-display text-3xl text-ember mb-3">Enquiry Received</h3>
                      <p className="font-body text-smoke text-sm mb-8 max-w-sm mx-auto">
                        Thanks! We'll review your order and get back to you within 24 hours to confirm availability and details.
                      </p>
                      <div className="bg-charcoal-light border border-[rgba(196,148,58,0.1)] rounded-lg p-5 max-w-sm mx-auto text-left space-y-3">
                        <p className="font-body text-xs uppercase tracking-wider text-smoke">What happens next</p>
                        <div className="space-y-2">
                          {['We review your order and check availability', 'We contact you to confirm details and pricing', 'You receive a final quote', 'Pay deposit to confirm your booking'].map((step, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="font-body text-[0.6rem] text-ember bg-ember/10 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                              <span className="font-body text-xs text-cream">{step}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-3 border-t border-[rgba(196,148,58,0.1)]">
                          <p className="font-body text-xs text-smoke">Questions? Reach us at:</p>
                          <p className="font-body text-sm text-ember mt-1">WhatsApp: [ADD NUMBER]</p>
                          <p className="font-body text-xs text-smoke mt-0.5">info@smokehousehk.com</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-display text-2xl text-cream mb-6">Review Your Order</h3>

                      {/* Items */}
                      <div className="bg-charcoal-light border border-[rgba(196,148,58,0.1)] rounded-lg p-5 mb-6">
                        <p className="font-body text-xs uppercase tracking-wider text-smoke mb-3">Items</p>
                        <div className="space-y-0">
                          {selectedItemsList.map((item) => (
                            <div key={item.menuItem.id} className="flex justify-between items-center py-2.5 border-b border-[rgba(196,148,58,0.08)] last:border-0">
                              <span className="font-body text-sm text-cream">{item.menuItem.name} <span className="text-smoke">x{item.quantity}</span></span>
                              <span className="font-body text-sm font-semibold text-burnt">HK${(item.menuItem.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-[rgba(196,148,58,0.2)] space-y-1">
                          <div className="flex justify-between text-xs font-body text-smoke">
                            <span>Subtotal</span><span>HK${subtotal.toLocaleString()}</span>
                          </div>
                          {deliveryFee > 0 && (
                            <div className="flex justify-between text-xs font-body text-smoke">
                              <span>Delivery</span><span>HK${deliveryFee}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-body text-base text-cream pt-1">
                            <span>Total</span>
                            <span className="text-burnt font-semibold">HK${total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Event details summary */}
                      {eventDetails && (
                        <div className="bg-charcoal-light border border-[rgba(196,148,58,0.1)] rounded-lg p-5 mb-8">
                          <p className="font-body text-xs uppercase tracking-wider text-smoke mb-3">Event Details</p>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                            {[
                              ['Name', eventDetails.name],
                              ['Email', eventDetails.email],
                              ['Phone', eventDetails.phone],
                              ['Date', eventDetails.eventDate],
                              ['Event', eventDetails.eventType],
                              ['Guests', String(eventDetails.guestCount)],
                              ['Service', eventDetails.serviceType],
                            ].map(([label, value]) => (
                              <div key={label}>
                                <span className="font-body text-[0.6rem] uppercase text-smoke block">{label}</span>
                                <span className="font-body text-sm text-cream">{value || '—'}</span>
                              </div>
                            ))}
                            {eventDetails.deliveryAddress && (
                              <div className="col-span-2">
                                <span className="font-body text-[0.6rem] uppercase text-smoke block">Delivery Address</span>
                                <span className="font-body text-sm text-cream">{eventDetails.deliveryAddress}</span>
                              </div>
                            )}
                            {eventDetails.notes && (
                              <div className="col-span-2">
                                <span className="font-body text-[0.6rem] uppercase text-smoke block">Notes</span>
                                <span className="font-body text-sm text-cream">{eventDetails.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {submitStatus === 'error' && (
                        <p className="font-body text-sm text-red-400 mb-4">Something went wrong. Please try again.</p>
                      )}

                      <div className="flex flex-col sm:flex-row items-start gap-3">
                        <button onClick={() => goToStep(2)}
                          className="px-7 py-3 border border-[rgba(196,148,58,0.3)] text-smoke rounded font-body text-xs uppercase tracking-[0.1em] hover:border-ember hover:text-ember transition-colors cursor-pointer"
                        >Back</button>
                        <button
                          onClick={handleSubmitInquiry}
                          disabled={submitStatus === 'submitting'}
                          className="w-full sm:w-auto px-10 py-4 bg-ember text-charcoal rounded font-body text-sm uppercase tracking-[0.1em] hover:bg-burnt transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {submitStatus === 'submitting' ? 'Submitting…' : 'Submit Enquiry'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Order Summary */}
          <div className="hidden lg:block w-[35%]">
            <div className="sticky top-[120px]">
              <OrderSummaryPanel
                items={selectedItemsList}
                currentStep={currentStep}
                serviceType={currentStep >= 2 ? watchedServiceType : ''}
                onContinue={() => {
                  if (currentStep === 1) goToStep(2);
                  else if (currentStep === 2) handleSubmit(onEventFormSubmit)();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
