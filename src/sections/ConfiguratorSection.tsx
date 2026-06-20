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
import { categoryLabels, categoryOrder, categoryImages, eventTypeOptions, serviceTypeOptions } from '@/data/menu';
import type { ConfiguratorStep, EventDetails, SubmitStatus } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const eventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  eventType: z.string().min(1, 'Event type is required'),
  guestCount: z.string().min(1, 'Guest count is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  notes: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function ConfiguratorSection() {
  const { selectedItems, updateQuantity, selectedItemsList, menuItems } = useCatering();
  const [currentStep, setCurrentStep] = useState<ConfiguratorStep>(1);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const stepContentRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const animateStepTransition = useCallback((direction: 'next' | 'back', callback: () => void) => {
    const el = stepContentRef.current;
    if (!el) {
      callback();
      return;
    }

    const outX = direction === 'next' ? -30 : 30;
    const inX = direction === 'next' ? 30 : -30;

    gsap.to(el, {
      opacity: 0,
      x: outX,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        callback();
        gsap.fromTo(
          el,
          { opacity: 0, x: inX },
          { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.05 }
        );
      },
    });
  }, []);

  const goToStep = useCallback((step: ConfiguratorStep) => {
    if (step === 2 && selectedItemsList.length === 0) return;
    const direction = step > currentStep ? 'next' : 'back';
    animateStepTransition(direction as 'next' | 'back', () => {
      setCurrentStep(step);
      const cateringEl = document.getElementById('catering');
      if (cateringEl) {
        window.scrollTo({ top: cateringEl.offsetTop - 100, behavior: 'smooth' });
      }
    });
  }, [currentStep, selectedItemsList.length, animateStepTransition]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEventFormSubmit = useCallback((data: any) => {
    setEventDetails(data as EventDetails);
    goToStep(3);
  }, [goToStep]);

  const handleSubmitInquiry = useCallback(async () => {
    setSubmitStatus('submitting');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitStatus('success');
  }, []);

  const getCategorySelectedCount = useCallback((category: string) => {
    return selectedItemsList.filter((item) => item.menuItem.category === category).length;
  }, [selectedItemsList]);

  // Scroll reveal for form fields
  useEffect(() => {
    if (currentStep === 2) {
      const fields = document.querySelectorAll('.form-field-reveal');
      gsap.fromTo(
        fields,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out', delay: 0.1 }
      );
    }
  }, [currentStep]);

  return (
    <section id="catering" className="bg-charcoal py-20 md:py-[120px] px-6 md:px-10">
      <div className="max-w-[1100px] mx-auto">
        <SectionHeader
          label="CATERING"
          heading="Build Your Order"
          subtitle="Select your items, tell us about your event, and we'll handle the rest."
          align="left"
        />

        <StepIndicator currentStep={currentStep} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Step Content */}
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
                          <img
                            src={categoryImages[category]}
                            alt={`${label.title} BBQ`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
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
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">
                        Name *
                      </label>
                      <input
                        {...register('name')}
                        placeholder="Your name"
                        className="input-dark"
                      />
                      {errors.name && (
                        <span className="text-burnt text-xs mt-1">{errors.name.message}</span>
                      )}
                    </div>

                    <div className="form-field-reveal">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">
                        Email *
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="Email address"
                        className="input-dark"
                      />
                      {errors.email && (
                        <span className="text-burnt text-xs mt-1">{errors.email.message}</span>
                      )}
                    </div>

                    <div className="form-field-reveal">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">
                        Phone *
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        placeholder="Phone number"
                        className="input-dark"
                      />
                      {errors.phone && (
                        <span className="text-burnt text-xs mt-1">{errors.phone.message}</span>
                      )}
                    </div>

                    <div className="form-field-reveal">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">
                        Event Date *
                      </label>
                      <input
                        {...register('eventDate')}
                        type="date"
                        className="input-dark"
                      />
                      {errors.eventDate && (
                        <span className="text-burnt text-xs mt-1">{errors.eventDate.message}</span>
                      )}
                    </div>

                    <div className="form-field-reveal">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">
                        Event Type *
                      </label>
                      <select {...register('eventType')} className="input-dark">
                        <option value="">Event type</option>
                        {eventTypeOptions.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.eventType && (
                        <span className="text-burnt text-xs mt-1">{errors.eventType.message}</span>
                      )}
                    </div>

                    <div className="form-field-reveal">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">
                        Guest Count *
                      </label>
                      <input
                        {...register('guestCount')}
                        type="number"
                        min={1}
                        placeholder="Number of guests"
                        className="input-dark"
                      />
                      {errors.guestCount && (
                        <span className="text-burnt text-xs mt-1">{errors.guestCount.message}</span>
                      )}
                    </div>

                    <div className="form-field-reveal md:col-span-2">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-3 block">
                        Service Type *
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {serviceTypeOptions.map((type) => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input
                              {...register('serviceType')}
                              type="radio"
                              value={type}
                              className="sr-only peer"
                            />
                            <div className="w-4 h-4 rounded-full border-2 border-[rgba(196,148,58,0.3)] peer-checked:border-ember peer-checked:bg-ember flex items-center justify-center transition-colors">
                              <div className="w-1.5 h-1.5 rounded-full bg-charcoal opacity-0 peer-checked:opacity-100" />
                            </div>
                            <span className="font-body text-sm text-cream">{type}</span>
                          </label>
                        ))}
                      </div>
                      {errors.serviceType && (
                        <span className="text-burnt text-xs mt-1">{errors.serviceType.message}</span>
                      )}
                    </div>

                    <div className="form-field-reveal md:col-span-2">
                      <label className="font-body text-xs uppercase tracking-[0.08em] text-smoke mb-2 block">
                        Notes
                      </label>
                      <textarea
                        {...register('notes')}
                        rows={4}
                        placeholder="Any special requests or dietary requirements?"
                        className="input-dark resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-10">
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="px-7 py-3 border border-[rgba(196,148,58,0.3)] text-smoke rounded font-body text-xs uppercase tracking-[0.1em] hover:border-ember hover:text-ember transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-ember text-charcoal rounded font-body text-xs uppercase tracking-[0.1em] hover:bg-burnt transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Review */}
              {currentStep === 3 && (
                <div>
                  {submitStatus === 'success' ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 rounded-full bg-ember/20 flex items-center justify-center mx-auto mb-6">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C4943A" strokeWidth="2">
                          <polyline points="8,16 14,22 24,10" />
                        </svg>
                      </div>
                      <h3 className="font-display text-2xl text-ember">
                        Thank you! We'll be in touch within 24 hours to confirm your catering order.
                      </h3>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-display text-2xl text-cream mb-6">Your Order</h3>
                      <div className="space-y-0">
                        {selectedItemsList.map((item) => (
                          <div
                            key={item.menuItem.id}
                            className="flex justify-between items-center py-3 border-b border-[rgba(196,148,58,0.1)]"
                          >
                            <span className="font-body text-sm text-cream">
                              {item.menuItem.name} x{item.quantity}
                            </span>
                            <span className="font-body text-sm font-semibold text-burnt">
                              ${(item.menuItem.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-[rgba(196,148,58,0.3)]">
                          <span className="font-body text-base text-cream">Total</span>
                          <span className="font-body text-2xl font-semibold text-burnt">
                            ${selectedItemsList.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {eventDetails && (
                        <>
                          <h3 className="font-display text-2xl text-cream mt-10 mb-4">Event Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              ['Name', eventDetails.name],
                              ['Email', eventDetails.email],
                              ['Phone', eventDetails.phone],
                              ['Event Date', eventDetails.eventDate],
                              ['Event Type', eventDetails.eventType],
                              ['Guests', String(eventDetails.guestCount)],
                              ['Service', eventDetails.serviceType],
                            ].map(([label, value]) => (
                              <div key={label} className="py-2">
                                <span className="font-body text-[0.625rem] uppercase text-smoke block">{label}</span>
                                <span className="font-body text-sm text-cream">{value || '—'}</span>
                              </div>
                            ))}
                            {eventDetails.notes && (
                              <div className="md:col-span-2 py-2">
                                <span className="font-body text-[0.625rem] uppercase text-smoke block">Notes</span>
                                <span className="font-body text-sm text-cream">{eventDetails.notes}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      <div className="flex flex-col sm:flex-row items-start gap-3 mt-10">
                        <button
                          onClick={() => goToStep(2)}
                          className="px-7 py-3 border border-[rgba(196,148,58,0.3)] text-smoke rounded font-body text-xs uppercase tracking-[0.1em] hover:border-ember hover:text-ember transition-colors cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmitInquiry}
                          disabled={submitStatus === 'submitting'}
                          className="w-full sm:w-auto px-10 py-4 bg-ember text-charcoal rounded font-body text-sm uppercase tracking-[0.1em] hover:bg-burnt transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Sticky Order Summary (desktop) */}
          <div className="hidden lg:block w-[35%]">
            <div className="sticky top-[120px]">
              <OrderSummaryPanel
                items={selectedItemsList}
                currentStep={currentStep}
                onContinue={() => {
                  if (currentStep === 1) goToStep(2);
                  else if (currentStep === 2) {
                    handleSubmit(onEventFormSubmit)();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
