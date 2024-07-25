// src/pages/index.js
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div style={{ 
      padding: '20px',
      }}>
      <h1 className="head-text text-left">
      Home
      </h1>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
