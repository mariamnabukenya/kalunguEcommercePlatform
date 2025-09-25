import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { apiService } from '../lib/api';
import { Address } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AddressForm from '../components/AddressForm';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Addresses: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const queryClient = useQueryClient();

  const { data: addresses, isLoading } = useQuery(
    'user-addresses',
    () => apiService.getAddresses()
  );

  const addAddressMutation = useMutation(
    (data: any) => apiService.addAddress(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-addresses');
        setIsModalOpen(false);
        toast.success('Address added successfully');
      },
      onError: () => {
        toast.error('Failed to add address');
      },
    }
  );

  const updateAddressMutation = useMutation(
    ({ id, data }: { id: number; data: any }) => apiService.updateAddress(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-addresses');
        setIsModalOpen(false);
        setEditingAddress(null);
        toast.success('Address updated successfully');
      },
      onError: () => {
        toast.error('Failed to update address');
      },
    }
  );

  const deleteAddressMutation = useMutation(
    (id: number) => apiService.deleteAddress(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-addresses');
        toast.success('Address deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete address');
      },
    }
  );

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = (id: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      deleteAddressMutation.mutate(id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingAddress) {
      updateAddressMutation.mutate({ id: editingAddress.id, data });
    } else {
      addAddressMutation.mutate(data);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Addresses</h1>
          <Button onClick={handleAddAddress}>
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>

        {!addresses || addresses.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No addresses yet</h2>
            <p className="text-gray-600 mb-8">
              Add your first address to make checkout faster and easier.
            </p>
            <Button onClick={handleAddAddress}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">
                      {address.type === 'shipping' ? 'Shipping Address' : 'Billing Address'}
                    </h3>
                    {address.is_default && (
                      <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">
                    {address.first_name} {address.last_name}
                  </p>
                  {address.company && <p>{address.company}</p>}
                  <p>{address.address_line_1}</p>
                  {address.address_line_2 && <p>{address.address_line_2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  <p>{address.country}</p>
                  {address.phone && <p>{address.phone}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Address Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingAddress ? 'Edit Address' : 'Add New Address'}
          size="lg"
        >
          <AddressForm
            onSubmit={handleSubmit}
            initialData={editingAddress}
            isLoading={addAddressMutation.isLoading || updateAddressMutation.isLoading}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Addresses;
