export default function CompanyInfoPage() {
    return (
        <div className="min-h-screen bg-white p-8 font-sans text-gray-800">
            <header className="mb-12 border-b pb-4">
                <h1 className="text-3xl font-bold">Company Information</h1>
            </header>

            <main className="max-w-3xl space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-3">About Us</h2>
                    <p className="leading-relaxed">
                        We are a leading provider of secure verification services. Our platform ensures compliance and trust for businesses worldwide.
                        Founded with a mission to streamline identity verification, we uphold the highest standards of security and user privacy.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">Services</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Identity Verification</li>
                        <li>Document Authentication</li>
                        <li>Compliance Management</li>
                        <li>Fraud Prevention</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">Contact</h2>
                    <p>
                        For business inquiries, please reach out to our sales team or visit our main corporate website.
                    </p>
                </section>

                <div className="mt-12 p-4 bg-gray-50 rounded text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Verification Services. All rights reserved.</p>
                </div>
            </main>
        </div>
    );
}
