export default function CompanyInfoPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12 font-sans">
            <header className="mb-10 border-b border-[#e5e7eb] pb-6">
                <h1 className="text-3xl font-bold text-[#0c2074]">Company Information</h1>
            </header>

            <main className="space-y-10 text-[#2e2e32]">
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-[#0c2074]">About U.S. Bank</h2>
                    <p className="leading-relaxed text-[#555]">
                        Since 1863, we've been helping our customers, employees and communities make the most of what's possible.
                        Headquartered in Minneapolis, we are a financial services holding company with businesses across the United States
                        and in key international markets.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-[#0c2074]">Our Mission</h2>
                    <p className="leading-relaxed text-[#555]">
                        We invest our hearts and minds to power human potential.
                    </p>
                </section>

                <section>
                    <hr className="border-[#e5e7eb]" />
                    <div className="mt-8">
                        <p className="text-sm text-[#555]">
                            For more details, please visit our main website at <a href="https://www.usbank.com" className="text-[#0a41c5] underline hover:no-underline" target="_blank" rel="noopener noreferrer">usbank.com</a>.
                        </p>
                    </div>
                </section>

                <footer className="pt-8 text-sm text-[#7a7a95]">
                    &copy; {new Date().getFullYear()} U.S. Bank. All rights reserved.
                </footer>
            </main>
        </div>
    );
}
