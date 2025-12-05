"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Mail, Building2, Calendar, Loader2, Download } from "lucide-react";
import { getFestRegistrations, fetchFestBySlug, getAuthToken, type Registration, type Fest } from "@/lib/api";

export default function FestRegistrationsPage() {
  const params = useParams();
  const router = useRouter();
  const festId = params.festId as string;

  const [fest, setFest] = useState<Fest | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const regs = await getFestRegistrations(festId);
        setRegistrations(regs);

        if (regs.length > 0 && regs[0].fest) {
          setFest(regs[0].fest as Fest);
        }
      } catch (err) {
        console.error("Failed to load registrations:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load registrations");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [festId, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToCSV = () => {
    if (registrations.length === 0) return;

    const headers = ["Name", "Email", "College", "Registration Date", "Status", "Payment Status"];
    const rows = registrations.map((reg) => [
      (reg.user as any)?.name || "N/A",
      (reg.user as any)?.email || "N/A",
      (reg.user as any)?.college || "N/A",
      formatDate(reg.registrationDate || reg.createdAt),
      reg.status,
      reg.paymentStatus,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${fest?.slug || "fest"}-registrations.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-black">Error</h1>
          <p className="text-gray-600">{error}</p>
          <Link
            href="/host"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Host Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-6 lg:px-16 py-5 flex justify-between items-center">
          <Link
            href="/host"
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Host Dashboard
          </Link>

          <Link href="/" className="text-3xl tracking-tight text-black" style={{ fontFamily: 'var(--font-caveat-brush)' }}>
            Gofest.com
          </Link>

          <div className="w-24" />
        </div>
      </header>

      <main className="px-6 lg:px-16 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">
                  {fest?.title || "Fest"} - Registrations
                </h1>
                <p className="text-gray-600">
                  {fest?.college && `${fest.college} • `}
                  Total Registrations: {registrations.length}
                </p>
              </div>
              
              {registrations.length > 0 && (
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              )}
            </div>
          </div>

          {registrations.length === 0 ? (
            <div className="text-center py-16 border border-gray-200 rounded-lg bg-gray-50">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No registrations yet
              </h2>
              <p className="text-gray-500">
                When people register for your fest, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        College
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {registrations.map((registration) => {
                      const user = registration.user as any;
                      return (
                        <tr key={registration._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-black">
                                {user?.name || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {user?.email || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {user?.college || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {formatDate(registration.registrationDate || registration.createdAt)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                registration.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : registration.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {registration.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                registration.paymentStatus === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : registration.paymentStatus === "not_required"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {registration.paymentStatus === "not_required"
                                ? "Free"
                                : registration.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

