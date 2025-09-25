import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { User, Mail, Lock, Shield } from 'lucide-react';
import { apiService } from '../../lib/api';
import Button from '../Button';
import Input from '../Input';
import toast from 'react-hot-toast';

interface UserFormProps {
  user?: any;
  onSubmit: () => void;
  onCancel: () => void;
}

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  is_active: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      role: user?.role || 'user',
      is_active: user?.is_active ?? true,
    },
  });

  const createUserMutation = useMutation(
    (data: UserFormData) => apiService.createUser(data),
    {
      onSuccess: () => {
        toast.success('User created successfully');
        onSubmit();
      },
      onError: () => {
        toast.error('Failed to create user');
      },
    }
  );

  const updateUserMutation = useMutation(
    ({ id, data }: { id: number; data: UserFormData }) => apiService.updateUser(id, data),
    {
      onSuccess: () => {
        toast.success('User updated successfully');
        onSubmit();
      },
      onError: () => {
        toast.error('Failed to update user');
      },
    }
  );

  const onFormSubmit = (data: UserFormData) => {
    if (user) {
      updateUserMutation.mutate({ id: user.id, data });
    } else {
      createUserMutation.mutate(data);
    }
  };

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'superadmin', label: 'Super Admin' },
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Full Name *"
          icon={User}
          {...register('name', { 
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          error={errors.name?.message}
        />

        <Input
          label="Email Address *"
          type="email"
          icon={Mail}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
        />

        <Input
          label={user ? 'New Password (leave blank to keep current)' : 'Password *'}
          type="password"
          icon={Lock}
          {...register('password', {
            required: !user ? 'Password is required' : false,
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
          error={errors.password?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {errors.role && (
            <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_active')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            Active user
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={createUserMutation.isLoading || updateUserMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={createUserMutation.isLoading || updateUserMutation.isLoading}
          disabled={createUserMutation.isLoading || updateUserMutation.isLoading}
        >
          {user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
