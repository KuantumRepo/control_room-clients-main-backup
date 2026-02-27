'use client';

/**
 * Brex Footer
 *
 * Footer links and copyright matching Brex reference design
 * Security · Privacy · Terms · Cookie Policy
 * © 2025 Brex Inc.
 */

export function BrexFooter() {
    return (
        <footer className="brex-footer">
            <div className="footer-links">
                <a href="#">Security</a>
                <span className="dot">&middot;</span>
                <a href="#">Privacy</a>
                <span className="dot">&middot;</span>
                <a href="#">Terms</a>
                <span className="dot">&middot;</span>
                <a href="#">Cookie Policy</a>
            </div>
            <div className="copyright">
                © 2025 Brex Inc.
            </div>
        </footer>
    );
}
