import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});

  // GSAP refs
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const fieldsRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    if (user)
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
  }, [user, navigate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        formRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
      )
        .fromTo(
          titleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.4",
        )
        .fromTo(
          fieldsRef.current?.children || [],
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.3",
        )
        .fromTo(
          rightRef.current,
          { x: 80, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm)
      newErrors.confirm = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created! Welcome to GymApp 💪");
      navigate("/dashboard");
    } catch (err) {
      gsap.to(formRef.current, {
        x: [-10, 10, -8, 8, -4, 4, 0],
        duration: 0.5,
        ease: "power2.out",
      });
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="bg-dark flex min-h-screen">
      {/* Left — form panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div ref={formRef} className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <span className="font-display text-primary text-2xl tracking-widest">
              ⚡ GYMAPP
            </span>
          </div>

          <div ref={titleRef} className="mb-10">
            <h2 className="font-display mb-2 text-5xl tracking-wider text-white">
              JOIN NOW
            </h2>
            <p className="text-gray-500">
              Already a member?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div ref={fieldsRef} className="flex flex-col gap-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
              />
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
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                error={errors.confirm}
              />

              <Button type="submit" loading={loading}>
                CREATE ACCOUNT
              </Button>

              <div className="flex items-center gap-4">
                <div className="bg-border h-px flex-1" />
                <span className="text-xs tracking-widest text-gray-600 uppercase">
                  or
                </span>
                <div className="bg-border h-px flex-1" />
              </div>

              <Link to="/login">
                <Button type="button" variant="outline">
                  SIGN IN INSTEAD
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right — branding panel */}
      <div
        ref={rightRef}
        className="bg-surface relative hidden w-1/2 flex-col justify-between overflow-hidden p-16 lg:flex"
      >
        <div className="bg-primary absolute top-0 left-0 h-64 w-64 rounded-full opacity-5 blur-3xl" />
        <div className="bg-primary absolute right-0 bottom-0 h-48 w-48 rounded-full opacity-5 blur-3xl" />

        <div>
          <h1 className="font-display my-12 text-8xl leading-none text-white">
            START
            <br />
            YOUR
            <br />
            <span className="text-primary">JOURNEY.</span>
          </h1>
          <p className="max-w-sm text-lg leading-relaxed text-gray-400">
            Your first rep starts here. Get access to world-class facilities,
            expert trainers, and a community that pushes you forward.
          </p>
        </div>

        {/* Benefits list */}
        <div className="flex flex-col gap-4">
          {[
            "Access to all gym equipment",
            "Expert trainer guidance",
            "Flexible membership plans",
            "Track your progress",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-3">
              <span className="text-primary font-bold">✓</span>
              <span className="text-sm text-gray-400">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;
