"use client";
import { useState, useEffect } from "react";

export default function ShowModal({ 
  showModal, 
  onClose, 
  title = "Detalles del Registro",
  data = {},
  fields = []
}) {
  if (!showModal) return null;

const formatValue = (field, value) => {
  if (value === null || value === undefined || value === '') {
    return field.emptyText || 'No especificado';
  }

  switch (field.type) {
    case 'boolean':
    case 'checkbox':
      return value ? (field.trueText || 'Sí') : (field.falseText || 'No');

    case 'date':
      try {
        return new Date(value).toLocaleDateString('es-ES');
      } catch {
        return value;
      }

    case 'datetime':
    case 'datetime-local':
      try {
        return new Date(value).toLocaleString('es-ES');
      } catch {
        return value;
      }

    case 'number':
    case 'currency':
      if (field.type === 'currency') {
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: field.currency || 'EUR'
        }).format(value);
      }
      return value.toLocaleString('es-ES');

    case 'percentage':
      return `${value}%`;

    case 'email':
      return (
        <a 
          href={`mailto:${value}`} 
          className="text-blue-600 hover:text-blue-800 underline"
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </a>
      );

    case 'url':
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </a>
      );

    case 'phone':
      return (
        <a 
          href={`tel:${value}`} 
          className="text-blue-600 hover:text-blue-800 underline"
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </a>
      );

    case 'object':
      if (typeof value === 'object' && value !== null) {
        return (
          value[field.displayKey] ||
          value[field.fallbackKey] ||
          'Sin información'
        );
      }
      return 'Sin información';

    case 'text':
    case 'textarea':
    default:
      if (field.maxDisplayLength && value.length > field.maxDisplayLength) {
        return (
          <span title={value}>
            {value.substring(0, field.maxDisplayLength)}...
          </span>
        );
      }
      return value;
  }
};

  const renderField = (field) => {
    const { 
      name, 
      label, 
      type = 'text',
      hidden = false,
      fullWidth = false,
      icon
    } = field;

    // No mostrar campos ocultos
    if (hidden) return null;

    const value = data[name];
    const formattedValue = formatValue(field, value);

    // Aplicar transformación personalizada si existe
    const finalValue = field.transform ? field.transform(value, data) : formattedValue;

    return (
      <div 
        key={name} 
        className={`${fullWidth ? 'col-span-2' : ''} ${field.className || ''}`}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            {icon && <span className="text-gray-500">{icon}</span>}
            <label className="text-sm font-semibold text-[#7fd1fc] uppercase tracking-wide">
              {label}
            </label>
          </div>
          <div className="text-gray-200 text-base">
            {field.render ? field.render(value, data) : finalValue}
          </div>
          {field.helpText && (
            <div className="text-xs text-gray-500 mt-1">
              {field.helpText}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStatus = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 border-green-200', text: 'Activo' },
      inactive: { color: 'bg-red-100 text-red-800 border-red-200', text: 'Inactivo' },
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Pendiente' },
      completed: { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Completado' },
      cancelled: { color: 'bg-gray-100 text-gray-800 border-gray-200', text: 'Cancelado' }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#23292e] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl shadow-black">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              {data.id && (
                <p className="text-lg text-gray-200 mt-2">ID: {data.id}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-black text-3xl font-light transition-colors duration-100"
              title="Cerrar"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status badge if exists */}
          {data.status && (
            <div className="mb-6 ">
              {renderStatus(data.status)}
            </div>
          )}

          {/* Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {fields.map(renderField)}
          </div>

          {/* Additional custom content */}
          {data.additionalContent && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Información Adicional
              </h3>
              <div className="text-gray-700">
                {data.additionalContent}
              </div>
            </div>
          )}

          {/* Timestamps */}
          {(data.createdAt || data.updatedAt) && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Información del Sistema 
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                {data.createdAt && (
                  <div>
                    <span className="font-medium">Fecha de Creación:</span>
                    <br />
                    {new Date(data.createdAt).toLocaleString('es-ES')}
                  </div>
                )}
                {data.updatedAt && (
                  <div>
                    <span className="font-medium">Última Actualización:</span>
                    <br />
                    {new Date(data.updatedAt).toLocaleString('es-ES')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}