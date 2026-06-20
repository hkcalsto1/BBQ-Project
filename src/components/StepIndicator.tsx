import type { ConfiguratorStep } from '@/types';

interface Props {
  currentStep: ConfiguratorStep;
}

const steps = [
  { number: 1, label: 'Select Items' },
  { number: 2, label: 'Event Details' },
  { number: 3, label: 'Review' },
];

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-start justify-center gap-4 md:gap-8 mb-12">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isCompleted
                    ? 'bg-burnt border-burnt'
                    : isActive
                    ? 'bg-ember border-ember'
                    : 'bg-transparent border-[rgba(196,148,58,0.2)]'
                }`}
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#0A0A0A" strokeWidth="2">
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                ) : (
                  <span
                    className={`font-body text-xs font-semibold ${
                      isActive ? 'text-charcoal' : 'text-smoke'
                    }`}
                  >
                    {step.number}
                  </span>
                )}
              </div>
              <span
                className={`font-body text-[0.6rem] md:text-xs uppercase tracking-[0.08em] mt-2 transition-colors duration-300 ${
                  isCompleted
                    ? 'text-burnt'
                    : isActive
                    ? 'text-ember'
                    : 'text-smoke'
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="w-8 md:w-16 h-px mx-2 md:mx-4 mt-3.5 bg-[rgba(196,148,58,0.2)] relative overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-ember transition-all duration-500 ${
                    isCompleted ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
