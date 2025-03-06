"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriptionFrequency } from "@/types/subscription";
import { subscription_frequency } from "@/constants/frequency";

interface ScheduleSectionProps {
  onScheduleChange: (schedule: {
    startDate: Date;
    frequency: SubscriptionFrequency;
    endDate: Date | undefined;
  }) => void;
  initialSchedule?: {
    startDate?: Date;
    frequency?: SubscriptionFrequency;
    endDate?: Date;
  };
}

export function ScheduleSection({
  onScheduleChange,
  initialSchedule,
}: ScheduleSectionProps) {
  const [startDate, setStartDate] = useState<Date>(
    initialSchedule?.startDate || new Date()
  );
  const [frequency, setFrequency] = useState<SubscriptionFrequency>(
    initialSchedule?.frequency || "Monthly"
  );
  const [endDate, setEndDate] = useState<Date | undefined>(initialSchedule?.endDate);
  const [showEndDate, setShowEndDate] = useState(!!initialSchedule?.endDate);

  const FREQUENCY_TO_DAYS = {
    Weekly: 7,
    "Every 2 weeks": 14,
    "Every 4 weeks": 28,
    Monthly: 30,
    Quarterly: 90,
    "Every 6 months": 180,
    Yearly: 365,
  };

  const calculateInvoicesCount = () => {
    if (!startDate || !frequency || (!endDate && !showEndDate)) return 0;

    const daysPerCycle = FREQUENCY_TO_DAYS[frequency as keyof typeof FREQUENCY_TO_DAYS];
    if (!daysPerCycle) return 0;

    const start = startDate.getTime();
    const end = endDate ? endDate.getTime() : new Date().getTime();
    const totalDays = (end - start) / (1000 * 60 * 60 * 24);
    const invoicesCount = Math.floor(totalDays / daysPerCycle) + 1;

    return invoicesCount > 0 ? invoicesCount : 0;
  };

  const handleScheduleChange = (newFrequency?: SubscriptionFrequency) => {
    onScheduleChange({
      startDate,
      frequency: newFrequency || frequency,
      endDate: showEndDate ? endDate : undefined,
    });
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">SCHEDULE</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <Input
            type="date"
            value={
              startDate
                ? startDate.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : new Date();
              setStartDate(date);
              handleScheduleChange();
            }}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Frequency</label>
          <Select
            value={frequency}
            onValueChange={(value: SubscriptionFrequency) => {
              setFrequency(value);
              handleScheduleChange(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {subscription_frequency.map((freq) => (
                <SelectItem key={freq} value={freq}>
                  {freq}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date (optional)
          </label>
          {showEndDate ? (
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={
                  endDate
                    ? endDate.toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined;
                  setEndDate(date);
                  handleScheduleChange();
                }}
                className="w-full"
              />
              <span className="text-sm text-gray-500">
                {calculateInvoicesCount()} invoice{calculateInvoicesCount() !== 1 ? "s" : ""} left
              </span>
              <Button
                size="sm"
                onClick={() => {
                  setShowEndDate(false);
                  setEndDate(undefined);
                  handleScheduleChange();
                }}
              >
                Remove end date
              </Button>
            </div>
          ) : (
            <Button

              onClick={() => {
                setShowEndDate(true);
                handleScheduleChange();
              }}
            >
              Add an end date
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}