import React from 'react';
import Image from 'next/image';

export const Sidebar = () => {
    const securityLinks = [
        { text: 'KeepSafe', href: 'https://www.kiwibank.co.nz/contact-us/security/ways-we-keep-you-safe/keepsafe/' },
        { text: 'Internet banking guarantee', href: 'https://www.kiwibank.co.nz/contact-us/security/ways-we-keep-you-safe/internet-banking-guarantee/' },
        { text: 'Staying safe online', href: 'https://www.kiwibank.co.nz/contact-us/security/' },
        { text: 'Forward suspicious emails', href: 'https://www.kiwibank.co.nz/contact-us/security/ways-to-keep-yourself-safe/phishing/' },
    ];

    return (
        <aside className="w-[180px] shrink-0 pt-0 mt-[24px] md:mt-0">
            <nav className="mb-[16px]" aria-label="Security links">
                <ul className="list-none m-0 p-0">
                    {securityLinks.map((item) => (
                        <li key={item.text} className="mb-[2px]">
                            <a
                                href={item.href}
                                className="block pl-[12px] text-[11px] leading-[16.8px] text-[#009de5] bg-[url('data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'5\'%20height=\'8\'%20viewBox=\'0%200%205%208\'%3E%3Cpath%20fill=\'%23009de5\'%20d=\'M0%200l5%204-5%204z\'/%3E%3C/svg%3E')] bg-no-repeat bg-[0_6px] hover:underline"
                            >
                                {item.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-[12px]">
                <Image
                    src="/fraudwatch-logo-266.png"
                    alt="FraudWatch International"
                    width={133}
                    height={50}
                    className="block"
                    style={{ width: '133px', height: 'auto' }}
                />
            </div>
        </aside>
    );
};
