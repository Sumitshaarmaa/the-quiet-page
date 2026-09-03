"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Logo from "@/app/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] text-[#272622]">

      {/* HEADER */}

      <header className="border-b border-[#dedbd2]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

          <Logo />

          <Link
            href="/"
            className="text-sm text-[#77736a] transition-colors hover:text-[#272622]"
          >
            ← Return home
          </Link>

        </div>
      </header>


      {/* LOGIN AREA */}

      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-20">

        <div className="w-full max-w-md">

          {/* INTRO */}

          <div className="mb-12">

            <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-[#928d82]">
              Private space
            </p>

            <h1 className="font-serif text-5xl tracking-[-0.04em] md:text-6xl">
              Welcome back.
            </h1>

            <p className="mt-5 text-sm leading-7 text-[#77736a]">
              This is the quiet side of the page. Sign in to manage your
              writings, genres and reader thoughts.
            </p>

          </div>


          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >

            {/* EMAIL */}

            <div>

              <label
                htmlFor="email"
                className="mb-3 block text-[9px] uppercase tracking-[0.3em] text-[#928d82]"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email"
                required
                className="w-full border-b border-[#cfcac0] bg-transparent px-1 py-4 text-sm outline-none placeholder:text-[#aaa59a] focus:border-[#272622]"
              />

            </div>


            {/* PASSWORD */}

            <div>

              <label
                htmlFor="password"
                className="mb-3 block text-[9px] uppercase tracking-[0.3em] text-[#928d82]"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                required
                className="w-full border-b border-[#cfcac0] bg-transparent px-1 py-4 text-sm outline-none placeholder:text-[#aaa59a] focus:border-[#272622]"
              />

            </div>


            {/* ERROR */}

            {error && (
              <div className="border border-[#c9a9a1] bg-[#eee1dc] px-4 py-3 text-sm text-[#75483e]">
                {error}
              </div>
            )}


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-between border border-[#272622] px-5 py-4 text-[10px] uppercase tracking-[0.25em] transition-all hover:bg-[#272622] hover:text-[#f5f3ed] disabled:cursor-not-allowed disabled:opacity-50"
            >

              <span>
                {loading
                  ? "Signing in..."
                  : "Enter the quiet side"}
              </span>

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>

            </button>

          </form>


          {/* FOOTER TEXT */}

          <p className="mt-12 text-center text-[10px] uppercase tracking-[0.2em] text-[#aaa59a]">
            Private access · The Quiet Page
          </p>

        </div>

      </section>

    </main>
  );
}