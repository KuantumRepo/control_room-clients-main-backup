import Link from 'next/link';

export function Footer() {
    return (
        <footer className="footer">
            <ul className="footer__list">
                <li className="footer__item">
                    <a href="#" className="footer__link">
                        Contact
                    </a>
                </li>
                <li className="footer__item">
                    <a href="#" className="footer__link">
                        Privacy
                    </a>
                </li>
                <li className="footer__item">
                    <a href="#" className="footer__link">
                        Terms of Use
                    </a>
                </li>
                <li className="footer__item">
                    {/* Internal links for debugging/navigation within the app */}
                    <Link href="/session/credentials" className="footer__link opacity-50">
                        [Dev: Login]
                    </Link>
                </li>
            </ul>
        </footer>
    );
}
