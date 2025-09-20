# MaachBazar WhatsApp Agent

A WhatsApp Business API agent for MaachBazar fish and poultry ordering system.

## Features

- WhatsApp webhook verification
- Message handling and responses
- Integration with WhatsApp Business API
- Environment-based configuration

## Deployment to maachbazar.in

### Prerequisites

1. Node.js 18+ installed
2. Vercel CLI installed: `npm install -g vercel`
3. Your WhatsApp Business API credentials

### Environment Variables

Set these in your Vercel dashboard or via CLI:

- `WHATSAPP_TOKEN`: Your WhatsApp Business API token
- `VERIFY_TOKEN`: Your webhook verification token (maachbazar-secret-123)
- `PHONE_NUMBER_ID`: Your WhatsApp phone number ID

### Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to production**:
   ```bash
   vercel --prod
   ```

4. **Set environment variables**:
   ```bash
   vercel env add WHATSAPP_TOKEN
   vercel env add VERIFY_TOKEN
   vercel env add PHONE_NUMBER_ID
   ```

5. **Configure custom domain** (maachbazar.in):
   ```bash
   vercel domains add maachbazar.in
   ```

### Webhook Configuration

After deployment, configure your webhook in Meta Developer Console:

- **Webhook URL**: `https://www.maachbazar.in/webhook`
- **Verify Token**: `maachbazar-secret-123`

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with your credentials:
   ```
   WHATSAPP_TOKEN=your_token_here
   VERIFY_TOKEN=maachbazar-secret-123
   PHONE_NUMBER_ID=your_phone_number_id
   ```

3. Run locally:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /webhook` - Webhook verification
- `POST /webhook` - Message handling

## License

ISC
