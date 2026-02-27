'use client';

/**
 * ASB Bank Footer
 * 
 * Simple footer with legal links separated by pipes
 * Matches the reference design exactly
 */

export function ASBFooter() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-links">
                    <a href="#">Terms and conditions</a>
                    <span className="separator">|</span>
                    <a href="#">About security</a>
                    <span className="separator">|</span>
                    <a href="#">Privacy</a>
                    <span className="separator">|</span>
                    <a href="#">Internet access terms</a>
                </div>
            </div>
        </footer>
    );
}
