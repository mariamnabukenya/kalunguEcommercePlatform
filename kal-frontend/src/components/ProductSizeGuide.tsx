import React, { useState } from 'react';
import { Ruler, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import Button from './Button';
import Modal from './Modal';

interface SizeGuideProps {
  className?: string;
  productType?: 'men' | 'women' | 'unisex';
}

const ProductSizeGuide: React.FC<SizeGuideProps> = ({
  className = '',
  productType = 'unisex',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sizeCharts = {
    men: {
      title: 'Men\'s Size Guide',
      measurements: [
        { size: 'XS', chest: '32-34', waist: '28-30', length: '26-27' },
        { size: 'S', chest: '34-36', waist: '30-32', length: '27-28' },
        { size: 'M', chest: '36-38', waist: '32-34', length: '28-29' },
        { size: 'L', chest: '38-40', waist: '34-36', length: '29-30' },
        { size: 'XL', chest: '40-42', waist: '36-38', length: '30-31' },
        { size: 'XXL', chest: '42-44', waist: '38-40', length: '31-32' },
      ],
    },
    women: {
      title: 'Women\'s Size Guide',
      measurements: [
        { size: 'XS', bust: '32-33', waist: '24-25', hips: '34-35' },
        { size: 'S', bust: '33-34', waist: '25-26', hips: '35-36' },
        { size: 'M', bust: '34-35', waist: '26-27', hips: '36-37' },
        { size: 'L', bust: '35-36', waist: '27-28', hips: '37-38' },
        { size: 'XL', bust: '36-37', waist: '28-29', hips: '38-39' },
        { size: 'XXL', bust: '37-38', waist: '29-30', hips: '39-40' },
      ],
    },
    unisex: {
      title: 'Unisex Size Guide',
      measurements: [
        { size: 'XS', chest: '32-34', waist: '28-30', length: '26-27' },
        { size: 'S', chest: '34-36', waist: '30-32', length: '27-28' },
        { size: 'M', chest: '36-38', waist: '32-34', length: '28-29' },
        { size: 'L', chest: '38-40', waist: '34-36', length: '29-30' },
        { size: 'XL', chest: '40-42', waist: '36-38', length: '30-31' },
        { size: 'XXL', chest: '42-44', waist: '38-40', length: '31-32' },
      ],
    },
  };

  const currentChart = sizeCharts[productType];

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <Ruler className="w-4 h-4 mr-1" />
        Size Guide
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={currentChart.title}
        size="lg"
      >
        <div className="space-y-6">
          {/* Measurement Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">How to Measure</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use a flexible measuring tape</li>
                  <li>• Measure over light clothing or undergarments</li>
                  <li>• Keep the tape snug but not tight</li>
                  <li>• Measure at the fullest part of your body</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Size Chart */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Size</th>
                  {productType === 'women' ? (
                    <>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Bust (in)</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Waist (in)</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Hips (in)</th>
                    </>
                  ) : (
                    <>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Chest (in)</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Waist (in)</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Length (in)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentChart.measurements.map((measurement, index) => (
                  <tr
                    key={measurement.size}
                    className={cn(
                      'border-b border-gray-100',
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    )}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {measurement.size}
                    </td>
                    {productType === 'women' ? (
                      <>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {measurement.bust}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {measurement.waist}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {measurement.hips}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {measurement.chest}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {measurement.waist}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {measurement.length}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Additional Notes */}
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Note:</strong> Sizes may vary slightly between different styles and cuts.
              If you're between sizes, we recommend sizing up for a more comfortable fit.
            </p>
            <p>
              <strong>Still unsure?</strong> Contact our customer service team for personalized sizing assistance.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductSizeGuide;
