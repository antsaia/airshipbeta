import React from 'react';

const Legal = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Legal</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Terms of Service</h2>
          <p className="text-gray-600 mb-4">
            These Terms of Service govern your use of Airship's services. By using our services, 
            you agree to these terms. Please read them carefully.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Level Agreement</h2>
          <p className="text-gray-600 mb-4">
            Our Service Level Agreement (SLA) defines the service level commitments that Airship 
            provides to customers using our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
          <p className="text-gray-600 mb-4">
            Our Acceptable Use Policy outlines the permitted uses and prohibited activities 
            when using Airship services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Processing Agreement</h2>
          <p className="text-gray-600 mb-4">
            Our Data Processing Agreement (DPA) reflects our commitment to data protection 
            and privacy compliance.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Legal;