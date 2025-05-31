import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Information Collection</h2>
          <p className="text-gray-600 mb-4">
            We collect information to provide better services to our customers and improve 
            user experience. This includes information you provide to us, data we collect 
            from your use of our services, and information from third-party sources.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Use of Information</h2>
          <p className="text-gray-600 mb-4">
            We use the information we collect to provide, maintain, and improve our services, 
            develop new features, protect our users, and communicate with you about our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Storage and Security</h2>
          <p className="text-gray-600 mb-4">
            We maintain strict security measures to protect your information. This includes 
            physical, technical, and administrative safeguards designed to protect your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
          <p className="text-gray-600 mb-4">
            You have certain rights regarding your personal information, including the right 
            to access, correct, or delete your data. We provide tools and settings to help 
            you manage your information.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;