
Northstar Support Chatbot - AGENTS.md

This file documents the AI agents used in the Northstar Support
Chatbot CrewAI flow.
All agents are orchestrated using CrewAI and deployed on Netlify at
https://northstarprojo.netlify.app.

---

Agent Roles

1. GitHub Documentation Retriever
- Role: Fetch DECISION_TREES.md from GitHub at runtime
- Purpose: Provides the chatbot with the latest classification and
routing rules before any customer message is processed
- Tool: GitHub get_raw_repository_content

2. Customer Classifier and Contact Collector
- Role: Classify the customer message into one of four categories
- Categories: stock_availability, return_request, out_of_scope, contact_capture
- Also determines whether a customer email needs to be collected
- Inputs: customer message, decision tree context from GitHub

3. Email Extractor
- Role: Extract any email address from the customer's free-text message
- Returns a JSON object: {"customer_email": "..."}
- Never fabricates an email address

4. Email Value Extractor
- Role: Parse the raw JSON output from the Email Extractor and return
a plain string email address
- Used downstream by all branch agents to send replies via Gmail

5. Query Router
- Role: Read the classifier output and extracted email, then emit one
routing event
- Emits one of: return_request, stock_availability, out_of_scope,
contact_capture
- Routes to contact_capture if needs_contact is true and no email has
been provided

6. Northstar Luxury Inventory Specialist
- Role: Answer customer stock questions using the hardcoded Northstar
product catalog
- Never fabricates product details
- Correctly distinguishes OUT OF STOCK (product exists but
unavailable) from NOT FOUND (product not in catalog)
- Catalog: 25 products across 6 categories, SKUs NS-001 to NS-055

7. Email Delivery Agent
- Role: Send the inventory reply to the customer via Gmail
- Subject: Your Northstar Product Enquiry
- Uses the extracted customer email

8. Returns Policy Specialist
- Role: Compose step-by-step return instructions based on Northstar policy
- Policy: 30-day window, unused items, FedEx drop-off, 5-7 day
refunds, exchanges available

9. Returns Reply Email Agent
- Role: Send the return instructions to the customer via Gmail
- Subject: Your Northstar Return Request

10. Customer Escalation Specialist
- Role: Compose a warm holding reply for out-of-scope queries
- Acknowledges the customer and flags for human follow-up
- Provides support@northstar.com for urgent matters

11. Escalation Reply Email Agent
- Role: Send the out-of-scope holding reply to the customer via Gmail
- Subject: We received your message - Northstar Support

12. Contact Detail Extractor
- Role: Extract any email address already in the customer message
- Returns JSON: {"email": "..."}

13. Contact Capture Reply Composer
- Role: Compose a friendly message asking the customer for their email address
- Explains that Northstar sends all replies by email
- Signs off as The Northstar Support Team

---

AI Safety Principle
No agent fabricates data. All product facts come from the Northstar
catalog (hardcoded) or live Firebase Realtime Database. Agents never
invent orders, tracking numbers, prices, stock levels, or return
eligibility.
