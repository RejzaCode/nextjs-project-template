"use client";

import React, { useState } from "react";
import { fetchOrderData, getPdfUrl } from "@/lib/ordersXml";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Label } from "@/components/ui/label";
import { Send, Printer } from "lucide-react";

const OrderEmailSender = () => {
  const [orderCode, setOrderCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Function to print PDF by opening it in a new window and triggering print
  const printPdf = (orderCode: string) => {
    const pdfUrl = getPdfUrl(orderCode);
    const printWindow = window.open(pdfUrl);
    if (printWindow) {
      printWindow.focus();
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to open PDF for printing.",
      });
    }
  };

  const handleSubmit = async () => {
    if (!orderCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an order code.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const orderData = await fetchOrderData(orderCode);
      if (!orderData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Order code not found or failed to load.",
        });
        setIsLoading(false);
        return;
      }

      const { email, phone } = orderData;

      // Format phone number for Google Messages
      const formattedPhone = phone.startsWith("+") ? phone.slice(1) : phone;

      // Create Google Messages link with pre-filled message
      const messageText = `MIRONET Liberec
Dobry den,
Vaše objednávka je připravena k osobnímu odběru na prodejně Liberec - Rumjancevova 127/22.
Objednávka je k vyzvednuti do 4 pracovních dnu od doručení této zprávy.
Vyzvednout si ji můžete kterýkoli pracovní den v čase 8:30-12:00 & 13:00-17:00. 
Mironet / MSTECH.CZ`;

      const googleMessagesUrl = `https://messages.google.com/web/conversations/new?text=${encodeURIComponent(messageText)}&phone=${formattedPhone}`;

      // Open Google Messages in a new tab
      window.open(googleMessagesUrl, '_blank');

      // Construct mailto link for email
      const subject = encodeURIComponent(`Objednávka č.: ${orderCode}`);
      const body = encodeURIComponent(messageText);
      const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

      // Open the default email client
      window.location.href = mailtoLink;

      toast({
        title: "Success",
        description: "Email client and Google Messages opened. Preparing to print PDF...",
      });

      // Print the PDF after a short delay
      setTimeout(() => {
        printPdf(orderCode);
      }, 2000);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching or parsing order XML.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Order Email & SMS Sender
          </CardTitle>
          <CardDescription className="text-center">
            Enter an order code to send notifications and print the order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderCode">Order Code</Label>
              <Input
                id="orderCode"
                type="text"
                placeholder="Enter Order Code"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                className="w-full bg-gray-50 border-gray-200"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full bg-black hover:bg-gray-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send Message & Print PDF</span>
                  <Printer className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default OrderEmailSender;
