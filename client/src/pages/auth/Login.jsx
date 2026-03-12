import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // GSAP refs
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const fieldsRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    }
  }, [user, navigate]);

  // GSAP entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Left panel slides in
      tl.fromTo(
        leftRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      )
        // Form panel fades up
        .fromTo(
          formRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.4",
        )
        // Title splits in
        .fromTo(
          titleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.3",
        )
        // Fields stagger in
        .fromTo(
          fieldsRef.current?.children || [],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
          "-=0.2",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      // Shake animation on error
      gsap.to(formRef.current, {
        x: [-10, 10, -8, 8, -4, 4, 0],
        duration: 0.5,
        ease: "power2.out",
      });
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="bg-dark flex min-h-screen">
      {/* Left — branding panel */}
      <div
        ref={leftRef}
        className="bg-surface relative hidden w-1/2 flex-col justify-between overflow-hidden p-16 lg:flex"
      >
        {/* Background accent */}
        <div className="bg-primary absolute top-0 right-0 h-64 w-64 rounded-full opacity-5 blur-3xl" />
        <div className="bg-primary absolute bottom-0 left-0 h-48 w-48 rounded-full opacity-5 blur-3xl" />

        <div>
          <h1 className="font-display my-12 text-8xl leading-none text-white">
            PUSH
            <br />
            YOUR
            <br />
            <span className="text-primary">LIMITS.</span>
          </h1>
          <p className="max-w-sm text-lg leading-relaxed text-gray-400">
            Join thousands of members who have transformed their lives through
            consistent training and discipline.
          </p>
        </div>

        <div className="flex gap-12">
          {[
            ["2K+", "Members"],
            ["15+", "Trainers"],
            ["98%", "Satisfaction"],
          ].map(([num, label]) => (
            <div key={label}>
              <p className="font-display text-primary text-3xl">{num}</p>
              <p className="text-sm tracking-widest text-gray-500 uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div ref={formRef} className="w-full max-w-md">

          <div ref={titleRef} className="mb-10">
            <h2 className="font-display mb-2 text-5xl tracking-wider text-white">
              SIGN IN
            </h2>
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Join now
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div ref={fieldsRef} className="flex flex-col gap-5">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
              />

              <Button type="submit" loading={loading}>
                SIGN IN
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="bg-border h-px flex-1" />
                <span className="text-xs tracking-widest text-gray-600 uppercase">
                  or
                </span>
                <div className="bg-border h-px flex-1" />
              </div>

              <Link to="/register">
                <Button type="button" variant="outline">
                  CREATE ACCOUNT
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
