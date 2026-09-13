// app/api/webhook/pakasir/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export const dynamic = 'force-dynamic';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'im4qx3kd', 
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-07-18',
  token: process.env.SANITY_API_WRITE_TOKEN, 
});

async function sendFonnteNotification(targetPhone: string, donorName: string, amount: number, programTitle: string, orderId: string) {
  const fonnteToken = process.env.FONNTE_API_TOKEN || '';
  if (!fonnteToken) {
    console.warn('[Fonnte Warning] FONNTE_API_TOKEN kosong.');
    return;
  }

  let formattedPhone = targetPhone.replace(/\D/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '62' + formattedPhone.slice(1);
  }

  const message = `Alhamdulillah, jazakumullahu khairan *${donorName}*! 🙏\n\nDonasi Anda sebesar *Rp ${amount.toLocaleString('id-ID')}* untuk program *${programTitle}* telah berhasil dikonfirmasi dan terverifikasi otomatis.\n\nNo. Invoice: \`${orderId}\`\n\nSemoga menjadi amal jariyah yang berlipat ganda, mendatangkan keberkahan, serta diberikan ganti yang lebih baik oleh Allah SWT. Aamiin ya Rabbal 'alamin. 🤲\n\n*Baitul Maal Al Muttaqin*`;

  try {
    console.log(`[Fonnte Debug] Mencoba mengirim pesan ke ${formattedPhone}...`);
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': fonnteToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: formattedPhone,
        message: message,
        countryCode: '62',
      }),
    });

    const result = await response.json();
    console.log(`[Fonnte Response]`, result);
  } catch (err) {
    console.error('[Fonnte Exception Error]:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[Webhook Payload diterima]:', JSON.stringify(body));
    
    const { amount, order_id, status, payment_method, completed_at } = body;
    const orderId = order_id;

    if (!orderId || !status) {
      console.warn('[Webhook Warning] Payload tidak lengkap:', body);
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    if (status === 'completed' || status === 'success') {
      const query = `*[_type == "donationTransaction" && orderId == $orderId][0]`;
      const transaction = await client.fetch(query, { orderId });

      let programTitle = 'Program Kebaikan';
      let donorPhone = '';
      let donorName = 'Hamba Allah';
      let donationAmount = Number(amount || 0);

      if (transaction) {
        donorPhone = transaction.donorPhone || '';
        donorName = transaction.donorName || 'Hamba Allah';
        donationAmount = Number(transaction.amount || amount || 0);

        await client
          .patch(transaction._id)
          .set({ 
            status: 'success',
            paymentMethod: payment_method || transaction.paymentMethod 
          })
          .commit();

        console.log(`[Sanity] Transaksi ${orderId} sukses diperbarui.`);

        const programSlug = transaction.slug || transaction.programSlug;
        if (programSlug) {
          const progQuery = `*[_type in ["program", "campaign"] && (slug.current == $slug || _id == $slug)][0]`;
          const programDoc = await client.fetch(progQuery, { slug: programSlug });

          if (programDoc) {
            programTitle = programDoc.title || programTitle;
            const currentCollected = Number(programDoc.collectedAmount || 0);
            const newCollected = currentCollected + donationAmount;

            const newDonorEntry = {
              _key: Math.random().toString(36).substring(2),
              name: donorName,
              amount: donationAmount,
              date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            };

            await client
              .patch(programDoc._id)
              .set({ collectedAmount: newCollected })
              .commit();
          }
        }
      } else {
        console.warn(`[Sanity Warning] Transaksi ${orderId} tidak ditemukan di database Sanity. Mencoba fallback data dari payload...`);
        // Fallback jika transaksi tidak ditemukan di Sanity (misal tes sandbox langsung)
        donorPhone = body.phone || body.whatsapp || '62895324383400'; // Sesuaikan jika ada
      }

      // Paksa kirim notif Fonnte meskipun transaksi tidak ketemu di Sanity (untuk keperluan uji coba)
      const targetNo = donorPhone; 
      await sendFonnteNotification(targetNo, donorName, donationAmount, programTitle, orderId);
    }

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
    
  } catch (error: any) {
    console.error('🔥 Pakasir Webhook Server Crash Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}