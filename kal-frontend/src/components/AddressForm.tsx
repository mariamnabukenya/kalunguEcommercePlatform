import React from 'react';
import { useForm } from 'react-hook-form';
import { AddressForm as AddressFormType } from '../types';
import { US_STATES, COUNTRIES } from '../lib/constants';
import Input from './Input';
import Button from './Button';

interface AddressFormProps {
  onSubmit: (data: AddressFormType) => void;
  initialData?: Partial<AddressFormType>;
  isLoading?: boolean;
  className?: string;
  title?: string;
}

const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  className = '',
  title = 'Address Information',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormType>({
    defaultValues: initialData,
  });

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">{title}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name *"
            {...register('first_name', {
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'First name must be at least 2 characters',
              },
            })}
            error={errors.first_name?.message}
          />
          
          <Input
            label="Last Name *"
            {...register('last_name', {
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: 'Last name must be at least 2 characters',
              },
            })}
            error={errors.last_name?.message}
          />
        </div>

        <Input
          label="Company"
          {...register('company')}
          error={errors.company?.message}
        />

        <Input
          label="Address Line 1 *"
          {...register('address_line_1', {
            required: 'Address is required',
            maxLength: {
              value: 255,
              message: 'Address must be no more than 255 characters',
            },
          })}
          error={errors.address_line_1?.message}
        />

        <Input
          label="Address Line 2"
          {...register('address_line_2')}
          error={errors.address_line_2?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              {...register('city', {
                required: 'City is required',
                maxLength: {
                  value: 100,
                  message: 'City must be no more than 100 characters',
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.city && (
              <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <select
              {...register('state', {
                required: 'State is required',
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select State</option>
              {US_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
            )}
          </div>

          <Input
            label="ZIP Code *"
            {...register('postal_code', {
              required: 'ZIP code is required',
              pattern: {
                value: /^\d{5}(-\d{4})?$/,
                message: 'Please enter a valid ZIP code',
              },
            })}
            error={errors.postal_code?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              {...register('country', {
                required: 'Country is required',
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select Country</option>
              {COUNTRIES.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-sm text-red-600 mt-1">{errors.country.message}</p>
            )}
          </div>

          <Input
            label="Phone"
            type="tel"
            {...register('phone', {
              pattern: {
                value: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number',
              },
            })}
            error={errors.phone?.message}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_default')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            Set as default address
          </label>
        </div>

        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
        >
          Save Address
        </Button>
      </form>
    </div>
  );
};

export default AddressForm;
