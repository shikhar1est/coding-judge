'use client';

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        CodeJudge
      </Link>
      <div className="space-x-4">
        <Link href="/problems">Problems</Link>
        <Link href="/submissions">Submissions</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
