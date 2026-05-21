const API_URL = `${import.meta.env.VITE_API_URL}/api/contact`

export async function sendContactForm(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response.json()
}