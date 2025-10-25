import React from 'react';
import Logo from './Logo.tsx';

const Footer: React.FC = () => {
    return (
        <footer className="w-full text-center py-6 text-gray-500 mt-8">
            <div className="container mx-auto flex items-center justify-center gap-2 px-4">
                <Logo className="w-5 h-5 text-indigo-400" />
                <span className="text-xs sm:text-sm">
                    © {new Date().getFullYear()} Lịch Nghỉ -{' '}
                    <a
                        href="https://beacons.ai/huyvu2512"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-indigo-500 hover:text-amber-500 transition-colors"
                    >
                        Huy Vũ
                    </a>
                    . All rights reserved.
                </span>
            </div>
        </footer>
    );
};

export default Footer;