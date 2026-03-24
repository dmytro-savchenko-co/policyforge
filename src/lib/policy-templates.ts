export interface PolicyFormData {
  businessName: string;
  websiteUrl: string;
  businessType: "website" | "app" | "saas" | "ecommerce" | "blog";
  contactEmail: string;
  country: string;
  jurisdictions: string[];
  dataCollected: string[];
  thirdPartyServices: string[];
  cookieTypes: string[];
  hasUserAccounts: boolean;
  sellsProducts: boolean;
  refundDays: number;
}

const currentDate = () => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function generatePrivacyPolicy(data: PolicyFormData): string {
  const sections: string[] = [];

  sections.push(`<h1>Privacy Policy for ${data.businessName}</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${currentDate()}</p>`);
  sections.push(`<p>This Privacy Policy describes how ${data.businessName} ("we," "us," or "our") collects, uses, and shares information about you when you use our ${data.businessType === "app" ? "application" : data.businessType === "saas" ? "software service" : "website"} located at ${data.websiteUrl} (the "Service").</p>`);
  sections.push(`<p>By using our Service, you agree to the collection and use of information in accordance with this policy.</p>`);

  // Information We Collect
  sections.push(`<h2>1. Information We Collect</h2>`);
  sections.push(`<h3>Information You Provide to Us</h3>`);

  const providedData: string[] = [];
  if (data.dataCollected.includes("name")) providedData.push("Name and contact information");
  if (data.dataCollected.includes("email")) providedData.push("Email address");
  if (data.dataCollected.includes("phone")) providedData.push("Phone number");
  if (data.dataCollected.includes("address")) providedData.push("Mailing or billing address");
  if (data.dataCollected.includes("payment")) providedData.push("Payment and billing information (processed securely through our payment processor)");
  if (data.hasUserAccounts) providedData.push("Account credentials (username and password)");
  if (data.dataCollected.includes("content")) providedData.push("Content you submit, post, or share through the Service");

  if (providedData.length > 0) {
    sections.push(`<p>We collect information you provide directly to us, including:</p>`);
    sections.push(`<ul>${providedData.map((d) => `<li>${d}</li>`).join("")}</ul>`);
  }

  sections.push(`<h3>Information We Collect Automatically</h3>`);
  sections.push(`<p>When you use our Service, we automatically collect certain information, including:</p>`);
  sections.push(`<ul>
    <li>Log data (IP address, browser type, operating system, referring URLs, pages viewed, and dates/times of visits)</li>
    <li>Device information (device type, unique device identifiers, and device settings)</li>
    ${data.dataCollected.includes("location") ? "<li>Approximate location data derived from your IP address</li>" : ""}
    ${data.dataCollected.includes("cookies") ? "<li>Cookies and similar tracking technologies (see our Cookie Policy for details)</li>" : ""}
  </ul>`);

  // How We Use
  sections.push(`<h2>2. How We Use Your Information</h2>`);
  sections.push(`<p>We use the information we collect to:</p>`);
  sections.push(`<ul>
    <li>Provide, maintain, and improve our Service</li>
    <li>Process transactions and send related information</li>
    <li>Send you technical notices, updates, security alerts, and administrative messages</li>
    <li>Respond to your comments, questions, and customer service requests</li>
    ${data.dataCollected.includes("email") ? "<li>Send you marketing communications (you can opt out at any time)</li>" : ""}
    <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
    <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
    <li>Comply with legal obligations</li>
  </ul>`);

  // Third Party Services
  if (data.thirdPartyServices.length > 0) {
    sections.push(`<h2>3. Third-Party Services</h2>`);
    sections.push(`<p>We may share your information with the following third-party service providers:</p>`);
    sections.push(`<ul>${data.thirdPartyServices.map((s) => {
      const serviceDescriptions: Record<string, string> = {
        "google-analytics": "Google Analytics — for website analytics and usage tracking",
        "stripe": "Stripe — for payment processing",
        "mailchimp": "Mailchimp — for email marketing",
        "intercom": "Intercom — for customer support and messaging",
        "facebook-pixel": "Meta/Facebook Pixel — for advertising and analytics",
        "hotjar": "Hotjar — for behavior analytics and user feedback",
        "sentry": "Sentry — for error tracking and monitoring",
        "cloudflare": "Cloudflare — for content delivery and security",
        "aws": "Amazon Web Services — for cloud hosting and data storage",
        "google-ads": "Google Ads — for advertising",
      };
      return `<li>${serviceDescriptions[s] || s}</li>`;
    }).join("")}</ul>`);
    sections.push(`<p>These third-party services have their own privacy policies and may collect information as described in their respective privacy policies.</p>`);
  }

  // Data Retention
  sections.push(`<h2>${data.thirdPartyServices.length > 0 ? "4" : "3"}. Data Retention</h2>`);
  sections.push(`<p>We retain your personal information for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.</p>`);

  // GDPR Section
  if (data.jurisdictions.includes("gdpr")) {
    sections.push(`<h2>Your Rights Under GDPR (European Economic Area)</h2>`);
    sections.push(`<p>If you are located in the European Economic Area (EEA), you have the following data protection rights under the General Data Protection Regulation (GDPR):</p>`);
    sections.push(`<ul>
      <li><strong>Right of Access:</strong> You have the right to request copies of your personal data.</li>
      <li><strong>Right to Rectification:</strong> You have the right to request correction of inaccurate personal data.</li>
      <li><strong>Right to Erasure:</strong> You have the right to request deletion of your personal data under certain conditions.</li>
      <li><strong>Right to Restrict Processing:</strong> You have the right to request restriction of processing of your personal data.</li>
      <li><strong>Right to Data Portability:</strong> You have the right to request transfer of your data to another organization or directly to you.</li>
      <li><strong>Right to Object:</strong> You have the right to object to our processing of your personal data.</li>
    </ul>`);
    sections.push(`<p>To exercise any of these rights, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>. We will respond to your request within 30 days.</p>`);
    sections.push(`<p><strong>Legal Basis for Processing:</strong> We process your personal data based on: (a) your consent, (b) the necessity for the performance of a contract, (c) compliance with legal obligations, and/or (d) our legitimate interests.</p>`);
  }

  // CCPA Section
  if (data.jurisdictions.includes("ccpa")) {
    sections.push(`<h2>Your Rights Under CCPA (California)</h2>`);
    sections.push(`<p>If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA):</p>`);
    sections.push(`<ul>
      <li><strong>Right to Know:</strong> You have the right to know what personal information we collect, use, disclose, and sell.</li>
      <li><strong>Right to Delete:</strong> You have the right to request deletion of your personal information.</li>
      <li><strong>Right to Opt-Out:</strong> You have the right to opt out of the sale of your personal information. We do not sell your personal information.</li>
      <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights.</li>
    </ul>`);
    sections.push(`<p>To exercise your rights, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>. We will verify your identity and respond within 45 days.</p>`);
  }

  // PIPEDA Section
  if (data.jurisdictions.includes("pipeda")) {
    sections.push(`<h2>Your Rights Under PIPEDA (Canada)</h2>`);
    sections.push(`<p>If you are a Canadian resident, you have rights under the Personal Information Protection and Electronic Documents Act (PIPEDA), including:</p>`);
    sections.push(`<ul>
      <li>The right to access your personal information held by us</li>
      <li>The right to challenge the accuracy and completeness of your information</li>
      <li>The right to withdraw consent for the collection, use, or disclosure of your information</li>
    </ul>`);
    sections.push(`<p>To exercise any of these rights, contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>.</p>`);
  }

  // Children's Privacy
  sections.push(`<h2>Children's Privacy</h2>`);
  sections.push(`<p>Our Service is not directed to children under the age of 16 (or 13 in jurisdictions where applicable). We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a> and we will promptly delete such information.</p>`);

  // Security
  sections.push(`<h2>Security</h2>`);
  sections.push(`<p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>`);

  // Changes
  sections.push(`<h2>Changes to This Privacy Policy</h2>`);
  sections.push(`<p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>`);

  // Contact
  sections.push(`<h2>Contact Us</h2>`);
  sections.push(`<p>If you have any questions about this Privacy Policy, please contact us:</p>`);
  sections.push(`<ul>
    <li>By email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></li>
    ${data.websiteUrl ? `<li>By visiting: <a href="${data.websiteUrl}">${data.websiteUrl}</a></li>` : ""}
  </ul>`);

  return sections.join("\n");
}

export function generateTermsOfService(data: PolicyFormData): string {
  const sections: string[] = [];

  sections.push(`<h1>Terms of Service for ${data.businessName}</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${currentDate()}</p>`);
  sections.push(`<p>Please read these Terms of Service ("Terms") carefully before using ${data.websiteUrl} (the "Service") operated by ${data.businessName} ("us," "we," or "our").</p>`);

  sections.push(`<h2>1. Acceptance of Terms</h2>`);
  sections.push(`<p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.</p>`);

  sections.push(`<h2>2. Description of Service</h2>`);
  sections.push(`<p>${data.businessName} provides ${
    data.businessType === "saas" ? "a software-as-a-service platform" :
    data.businessType === "ecommerce" ? "an online marketplace and e-commerce platform" :
    data.businessType === "app" ? "a mobile and/or web application" :
    data.businessType === "blog" ? "an online content and publishing platform" :
    "an online platform and website"
  } accessible at ${data.websiteUrl}.</p>`);

  if (data.hasUserAccounts) {
    sections.push(`<h2>3. User Accounts</h2>`);
    sections.push(`<p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your account password and for any activities or actions under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>`);
  }

  sections.push(`<h2>${data.hasUserAccounts ? "4" : "3"}. Intellectual Property</h2>`);
  sections.push(`<p>The Service and its original content, features, and functionality are and will remain the exclusive property of ${data.businessName}. The Service is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without our prior written consent.</p>`);

  sections.push(`<h2>Prohibited Uses</h2>`);
  sections.push(`<p>You agree not to use the Service:</p>`);
  sections.push(`<ul>
    <li>In any way that violates any applicable law or regulation</li>
    <li>To transmit any advertising or promotional material without our prior written consent</li>
    <li>To impersonate or attempt to impersonate the Company, an employee, another user, or any other person</li>
    <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
    <li>To introduce any viruses, trojan horses, worms, or other malicious code</li>
    <li>To attempt to gain unauthorized access to any portion of the Service</li>
  </ul>`);

  if (data.sellsProducts || data.businessType === "ecommerce" || data.businessType === "saas") {
    sections.push(`<h2>Payments and Billing</h2>`);
    sections.push(`<p>Certain features of the Service may require payment. You agree to provide current, complete, and accurate billing information. You agree to promptly update your account and other information so that we can complete your transactions and contact you as needed.</p>`);
    if (data.businessType === "saas") {
      sections.push(`<p>Subscriptions are billed in advance on a recurring basis (monthly or annually, depending on the plan selected). You may cancel your subscription at any time, and cancellation will take effect at the end of the current billing period.</p>`);
    }
  }

  sections.push(`<h2>Limitation of Liability</h2>`);
  sections.push(`<p>In no event shall ${data.businessName}, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service.</p>`);

  sections.push(`<h2>Disclaimer</h2>`);
  sections.push(`<p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.</p>`);

  sections.push(`<h2>Governing Law</h2>`);
  sections.push(`<p>These Terms shall be governed and construed in accordance with the laws of ${data.country || "the jurisdiction in which the Company operates"}, without regard to its conflict of law provisions.</p>`);

  sections.push(`<h2>Changes to Terms</h2>`);
  sections.push(`<p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our Service after revisions become effective, you agree to be bound by the revised terms.</p>`);

  sections.push(`<h2>Contact Us</h2>`);
  sections.push(`<p>If you have any questions about these Terms, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>.</p>`);

  return sections.join("\n");
}

export function generateCookiePolicy(data: PolicyFormData): string {
  const sections: string[] = [];

  sections.push(`<h1>Cookie Policy for ${data.businessName}</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${currentDate()}</p>`);
  sections.push(`<p>This Cookie Policy explains how ${data.businessName} ("we," "us," or "our") uses cookies and similar technologies on ${data.websiteUrl}. By using our website, you consent to our use of cookies in accordance with this policy.</p>`);

  sections.push(`<h2>What Are Cookies?</h2>`);
  sections.push(`<p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. Cookies can be "persistent" (remaining on your device until deleted) or "session" cookies (deleted when you close your browser).</p>`);

  sections.push(`<h2>How We Use Cookies</h2>`);
  sections.push(`<p>We use the following types of cookies:</p>`);

  const cookieList: string[] = [];
  if (data.cookieTypes.includes("essential")) {
    cookieList.push(`<li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies.</li>`);
  }
  if (data.cookieTypes.includes("analytics")) {
    cookieList.push(`<li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and your experience.</li>`);
  }
  if (data.cookieTypes.includes("functional")) {
    cookieList.push(`<li><strong>Functional Cookies:</strong> These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.</li>`);
  }
  if (data.cookieTypes.includes("marketing")) {
    cookieList.push(`<li><strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites to display relevant advertisements. They are usually placed by third-party advertising networks with our permission.</li>`);
  }
  sections.push(`<ul>${cookieList.join("")}</ul>`);

  if (data.thirdPartyServices.length > 0) {
    sections.push(`<h2>Third-Party Cookies</h2>`);
    sections.push(`<p>Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. The third-party services we use include:</p>`);
    sections.push(`<ul>${data.thirdPartyServices.map((s) => `<li>${s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</li>`).join("")}</ul>`);
  }

  sections.push(`<h2>Managing Cookies</h2>`);
  sections.push(`<p>Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or to alert you when a cookie is being sent. However, if you disable cookies, some parts of our website may not function properly.</p>`);
  sections.push(`<p>To manage your cookie preferences:</p>`);
  sections.push(`<ul>
    <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
    <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
    <li><strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data</li>
    <li><strong>Edge:</strong> Settings → Cookies and Site Permissions → Cookies</li>
  </ul>`);

  if (data.jurisdictions.includes("gdpr")) {
    sections.push(`<h2>Your Rights (GDPR)</h2>`);
    sections.push(`<p>Under GDPR, you have the right to consent to or reject non-essential cookies. We will ask for your consent before placing any non-essential cookies on your device. You can withdraw your consent at any time by adjusting your cookie settings on our website.</p>`);
  }

  sections.push(`<h2>Changes to This Cookie Policy</h2>`);
  sections.push(`<p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>`);

  sections.push(`<h2>Contact Us</h2>`);
  sections.push(`<p>If you have any questions about our use of cookies, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>.</p>`);

  return sections.join("\n");
}

export function generateRefundPolicy(data: PolicyFormData): string {
  const sections: string[] = [];

  sections.push(`<h1>Refund Policy for ${data.businessName}</h1>`);
  sections.push(`<p><strong>Last updated:</strong> ${currentDate()}</p>`);

  if (data.businessType === "saas") {
    sections.push(`<h2>Subscription Refunds</h2>`);
    sections.push(`<p>We offer a ${data.refundDays}-day money-back guarantee on all new subscriptions. If you are not satisfied with our service, you may request a full refund within ${data.refundDays} days of your initial purchase.</p>`);
    sections.push(`<h2>How to Request a Refund</h2>`);
    sections.push(`<p>To request a refund, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a> with your account details and the reason for your refund request. We will process your request within 5-10 business days.</p>`);
    sections.push(`<h2>Cancellation</h2>`);
    sections.push(`<p>You may cancel your subscription at any time. Upon cancellation, you will continue to have access to the Service until the end of your current billing period. No refunds will be issued for partial billing periods after the ${data.refundDays}-day guarantee window.</p>`);
  } else if (data.businessType === "ecommerce") {
    sections.push(`<h2>Return Policy</h2>`);
    sections.push(`<p>We accept returns within ${data.refundDays} days of delivery. Items must be unused, in their original packaging, and in the same condition as when you received them.</p>`);
    sections.push(`<h2>Refund Process</h2>`);
    sections.push(`<p>Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed to your original payment method within 5-10 business days.</p>`);
    sections.push(`<h2>Shipping Costs</h2>`);
    sections.push(`<p>Shipping costs for returns are the responsibility of the customer, unless the return is due to a defective or incorrect item. In such cases, we will provide a prepaid return label.</p>`);
  } else {
    sections.push(`<h2>Refunds</h2>`);
    sections.push(`<p>If you are not satisfied with our service, you may request a refund within ${data.refundDays} days of purchase. Please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a> with your request.</p>`);
  }

  sections.push(`<h2>Non-Refundable Items</h2>`);
  sections.push(`<ul>
    <li>Services that have been fully rendered or consumed</li>
    <li>Digital products that have been downloaded or accessed</li>
    <li>Custom or personalized orders</li>
  </ul>`);

  sections.push(`<h2>Contact Us</h2>`);
  sections.push(`<p>For any questions about our refund policy, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>.</p>`);

  return sections.join("\n");
}
