"use client";

import { useState, useEffect } from "react";
import { Event } from "@/types/calendar";
import { formatDate } from "@/utils/dateUtils";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, "id">) => void;
  selectedDate?: Date;
  editingEvent?: Event;
}

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  editingEvent,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("blue");

  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        setTitle(editingEvent.title);
        setDate(editingEvent.date);
        setTime(editingEvent.time);
        setDescription(editingEvent.description || "");
        setColor(editingEvent.color || "blue");
      } else if (selectedDate) {
        setDate(formatDate(selectedDate));
        setTime("09:00");
        setTitle("");
        setDescription("");
        setColor("blue");
      } else {
        // Reset form when opening without specific date or event
        setTitle("");
        setDate("");
        setTime("09:00");
        setDescription("");
        setColor("blue");
      }
    }
  }, [isOpen, editingEvent, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    onSave({
      title,
      date,
      time,
      description,
      color,
    });

    setTitle("");
    setDate("");
    setTime("");
    setDescription("");
    setColor("blue");
    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setDate("");
    setTime("");
    setDescription("");
    setColor("blue");
    onClose();
  };

  if (!isOpen) return null;

  const colorOptions = [
    {
      value: "blue",
      label: "Blue",
      bg: "bg-blue-100",
      border: "border-blue-300",
    },
    {
      value: "green",
      label: "Green",
      bg: "bg-green-100",
      border: "border-green-300",
    },
    {
      value: "purple",
      label: "Purple",
      bg: "bg-purple-100",
      border: "border-purple-300",
    },
    {
      value: "pink",
      label: "Pink",
      bg: "bg-pink-100",
      border: "border-pink-300",
    },
    {
      value: "orange",
      label: "Orange",
      bg: "bg-orange-100",
      border: "border-orange-300",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingEvent ? "Edit Event" : "Create New Event"}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event description (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Theme
              </label>
              <div className="flex space-x-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColor(option.value)}
                    className={`w-8 h-8 rounded-full border-2 ${option.bg} ${option.border} ${
                      color === option.value
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : ""
                    }`}
                    title={option.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
              >
                {editingEvent ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
