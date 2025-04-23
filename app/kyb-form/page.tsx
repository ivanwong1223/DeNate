"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Button,
    Typography,
    Input,
    Textarea,
    Checkbox,
    IconButton,
    CardFooter,
    Select,
    Option,
} from "@material-tailwind/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

// Animation variants for fade-in effect
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function KYBForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        registrationNumber: "",
        countryOfIncorporation: "",
        companyLocation: "",
        ownerName: "",
        ownerPhoneNumber: "",
        companyRegistrationProof: null as File | null, // File for company registration proof
    });
    const [isMalaysia, setIsMalaysia] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFormData((prev) => ({
            ...prev,
            companyRegistrationProof: file,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // start loading

        const { countryOfIncorporation, registrationNumber, companyRegistrationProof } = formData;

        if (!countryOfIncorporation) {
            alert("Please select a country of incorporation.");
            setIsLoading(false);
            return;
        }

        if (countryOfIncorporation === "MY") {
            if (!companyRegistrationProof) {
                alert("Please upload your company registration proof for Malaysia.");
                setIsLoading(false);
                return;
            }

            const ocrForm = new FormData();
            ocrForm.append("file", companyRegistrationProof);
            ocrForm.append("registrationNumber", registrationNumber); // Pass reg number too

            try {
                const ocrRes = await fetch("/api/ocr", {
                    method: "POST",
                    body: ocrForm,
                });

                const { match, extractedText } = await ocrRes.json();

                if (match) {
                    toast.success("✅ Organization Verified and Approved!", {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                    });

                    setTimeout(() => {
                        router.push("/register");
                    }, 2500);
                } else {
                    toast.error("❌ Invalid organization information. Please Try Again.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error("❌ OCR error:", error);
                alert("Failed to verify document with OCR.");
            } finally {
                setIsLoading(false);
            }

            return;
        }

        // 🌍 For other countries
        try {
            const res = await fetch("/api/verify-kyb", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    registrationNumber,
                    countryCode: countryOfIncorporation,
                    isConsent: true,
                }),
            });

            const result = await res.json();
            console.log("✅ KYB result:", result);
        } catch (error) {
            console.error("❌ KYB submission error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute top-4 left-4">
                <IconButton
                    variant="text"
                    color="blue-gray"
                    size="lg"
                    onClick={() => router.push("/")}
                    className="rounded-full"
                    placeholder={null}  // Removed the placeholder error
                    onPointerEnterCapture={undefined}  // Removed the onPointerEnterCapture error
                    onPointerLeaveCapture={undefined}  // Removed the onPointerLeaveCapture error
                >
                    <ArrowLeft className="h-5 w-5" />
                </IconButton>
            </div>
            <motion.div
                className="max-w-lg w-full bg-white shadow-lg rounded-xl p-8"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Typography
                        variant="h4"
                        color="blue-gray"
                        className="mb-2 font-bold"
                        placeholder={null}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        Organization Verfication Form
                    </Typography>
                    <Typography
                        color="gray"
                        className="font-normal text-gray-600"
                        placeholder={null}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        Verify your organization by providing the required details before creating your account
                    </Typography>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-5">
                        {/* Registration Number */}
                        <Input
                            label="Registration Number"
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            placeholder=""
                            crossOrigin={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        />

                        {/* Country of Incorporation Dropdown */}
                        <Select
                            label="Country of Incorporation"
                            value={formData.countryOfIncorporation}
                            onChange={(value) => {
                                const selectedCountry = value as string;
                                setFormData((prev) => ({
                                    ...prev,
                                    countryOfIncorporation: selectedCountry,
                                }));
                                setIsMalaysia(selectedCountry === "MY");
                            }}
                            placeholder=""
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            <Option value="MY">Malaysia</Option>
                            {/* <Option value="NG">Nigeria</Option> */}
                        </Select>

                        {/* Company Registration Proof File Upload */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">Company Registration Proof</label>
                            {/* File Input */}
                            <input
                                type="file"
                                name="companyRegistrationProof"
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                                required={isMalaysia}
                                className="border border-gray-300 rounded-lg p-2 w-full mt-2"
                            />
                            {/* Display File Name and Remove Button */}
                            {formData.companyRegistrationProof && (
                                <div className="flex items-center justify-between bg-gray-100 p-3 mt-3 rounded-lg">
                                    <div className="text-sm font-medium text-gray-800">
                                        File: {formData.companyRegistrationProof.name}
                                    </div>
                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, companyRegistrationProof: null }))}
                                        className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                className={`w-full rounded-lg py-3 transition-all ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                disabled={isLoading}
                                placeholder={null}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                            >
                                {isLoading ? "Processing..." : "Submit Form"}
                            </Button>
                        </motion.div>

                        {/* Footer */}
                        <CardFooter className="pt-0 text-center"
                            placeholder={null}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}>
                            <Typography variant="small" className="mt-4 text-gray-900"
                                placeholder={null}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}>
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-500 font-medium hover:underline">
                                    Sign In
                                </Link>
                            </Typography>
                        </CardFooter>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
