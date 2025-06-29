"use client";
import { useState, useEffect } from "react";

export default function CreateModal({
  showModal,
  onClose,
  onSave,
  title = "Nuevo Registro",
  fields = [],
  initialData = {}
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Inicializar formData cuando cambie la configuración de campos
  useEffect(() => {
    const initialFormData = {};
    fields.forEach(field => {
      if (initialData[field.name] !== undefined) {
        // Para campos de relación como categoryId, usar el ID
        if (field.name === 'categoryId' && initialData.category) {
          initialFormData[field.name] = initialData.category.id;
        } else {
          initialFormData[field.name] = initialData[field.name];
        }
      } else if (field.defaultValue !== undefined) {
        initialFormData[field.name] = field.defaultValue;
      } else {
        // Valores por defecto según el tipo
        switch (field.type) {
          case 'checkbox':
            initialFormData[field.name] = false;
            break;
          case 'number':
            initialFormData[field.name] = '';
            break;
          default:
            initialFormData[field.name] = '';
        }
      }
    });
    setFormData(initialFormData);
    setErrors({});
  }, [fields, initialData, showModal]);

  if (!showModal) return null;

  const handleFormChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    fields.forEach(field => {
      if (field.required) {
        const value = formData[field.name];

        if (field.type === 'checkbox') {
          // Para checkboxes, generalmente no se valida como requerido
          return;
        }

        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field.name] = field.errorMessage || `${field.label} es requerido`;
          return;
        }

        // Validación para campos de archivo
        if (field.type === 'file' && field.required) {
          // Solo requerir archivo si no hay imagen previa en modo edición
          if (!(value instanceof File) && !initialData[field.name]) {
            newErrors[field.name] = field.errorMessage || `Seleccione un archivo para ${field.label}`;
            return;
          }
        }

        // Validaciones específicas por tipo
        if (field.type === 'text' || field.type === 'textarea') {
          if (field.minLength && value.trim().length < field.minLength) {
            newErrors[field.name] = `${field.label} debe tener al menos ${field.minLength} caracteres`;
            return;
          }
          if (field.maxLength && value.trim().length > field.maxLength) {
            newErrors[field.name] = `${field.label} no puede exceder ${field.maxLength} caracteres`;
            return;
          }
        }

        if (field.type === 'number') {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            newErrors[field.name] = `${field.label} debe ser un número válido`;
            return;
          }
          if (field.min !== undefined && numValue < field.min) {
            newErrors[field.name] = `${field.label} debe ser mayor o igual a ${field.min}`;
            return;
          }
          if (field.max !== undefined && numValue > field.max) {
            newErrors[field.name] = `${field.label} debe ser menor o igual a ${field.max}`;
            return;
          }
        }
      }

      // Validación personalizada
      if (field.validate && formData[field.name]) {
        const customError = field.validate(formData[field.name], formData);
        if (customError) {
          newErrors[field.name] = customError;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // Procesar datos antes de enviar
      const processedData = {};
      fields.forEach(field => {
        let value = formData[field.name];

        // Procesar según el tipo de campo
        switch (field.type) {
          case 'text':
          case 'textarea':
            value = typeof value === 'string' ? value.trim() : value;
            break;
          case 'file':
            value = value instanceof File ? value : null;
            break;
          case 'number':
            value = value === '' ? null : Number(value);
            break;
          case 'checkbox':
            value = Boolean(value);
            break;
          default:
            // Mantener el valor tal como está
            break;
        }

        // Aplicar transformación personalizada si existe
        if (field.transform) {
          value = field.transform(value, formData);
        }

        processedData[field.name] = value;
      });

      console.log('Datos procesados para enviar:', processedData);

      await onSave(processedData);
      onClose();
    } catch (err) {
      console.error('Error en handleSubmit:', err);
      alert(`Error al guardar: ${err.message || 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const {
      name,
      label,
      type = 'text',
      placeholder,
      required,
      options = [],
      rows = 3,
      step,
      min,
      max,
      maxLength,
      disabled = false
    } = field;

    const commonProps = {
      value: formData[name] || '',
      onChange: (e) => handleFormChange(name, e.target.value),
      disabled: disabled || isSubmitting,
      className: `w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-500'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`
    };

    const renderInput = () => {
      switch (type) {
        case 'file':
          return (
            <input
              id={name}
              name={name}
              type="file"
              accept="image/*"
              onChange={e => handleFormChange(name, e.target.files[0])}
              disabled={disabled || isSubmitting}
              className={`w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-500'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          );

        case 'textarea':
          return (
            <textarea
              {...commonProps}
              rows={rows}
              placeholder={placeholder}
              maxLength={maxLength}
            />
          );

        case 'select':
          return (
            <select 
              {...commonProps}
              value={formData[name] || ''}
            >
              <option value="">Seleccione una opción</option>
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'checkbox':
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={name}
                checked={Boolean(formData[name])}
                onChange={(e) => handleFormChange(name, e.target.checked)}
                disabled={disabled || isSubmitting}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={name} className="text-sm font-medium text-gray-200">
                {label} {required && '*'}
              </label>
            </div>
          );

        case 'number':
          return (
            <input
              {...commonProps}
              type="number"
              step={step}
              min={min}
              max={max}
              placeholder={placeholder}
            />
          );

        case 'email':
          return (
            <input
              {...commonProps}
              type="email"
              placeholder={placeholder}
              maxLength={maxLength}
            />
          );

        case 'url':
          return (
            <input
              {...commonProps}
              type="url"
              placeholder={placeholder}
              maxLength={maxLength}
            />
          );

        case 'date':
          return (
            <input
              {...commonProps}
              type="date"
            />
          );

        case 'datetime-local':
          return (
            <input
              {...commonProps}
              type="datetime-local"
            />
          );

        default: // text
          return (
            <input
              {...commonProps}
              type="text"
              placeholder={placeholder}
              maxLength={maxLength}
            />
          );
      }
    };

    if (type === 'checkbox') {
      return (
        <div key={name}>
          {renderInput()}
          {errors[name] && (
            <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
          )}
        </div>
      );
    }

    return (
      <div key={name}>
        <label className="block text-1xl font-medium text-[#7fd1fc] mb-1">
          {label} {required && '*'}
        </label>
        {renderInput()}
        {errors[name] && (
          <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
        )}
        {field.helpText && (
          <p className="mt-1 text-sm text-gray-200">{field.helpText}</p>
        )}
      </div>
    );
  };

  const isFormValid = () => {
    return fields.every(field => {
      if (!field.required) return true;

      const value = formData[field.name];

      if (field.type === 'checkbox') return true;

      return value && (typeof value !== 'string' || value.trim() !== '');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#23292e] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl shadow-black">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-white hover:text-gray-300 text-3xl font-light transition-colors duration-100"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {fields.map(renderField)}

            <div className="flex gap-3 pt-4 border-t border-gray-500">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid()}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}