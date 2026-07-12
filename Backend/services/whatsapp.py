from twilio.rest import Client

# ============================
# TWILIO CONFIGURATION
# ============================

ACCOUNT_SID = "YOUR_ACCOUNT_SID"

AUTH_TOKEN = "YOUR_AUTH_TOKEN"

FROM_WHATSAPP = "whatsapp:+14155238886"

client = Client(
    ACCOUNT_SID,
    AUTH_TOKEN
)

# ============================
# SEND WHATSAPP MESSAGE
# ============================

def send_whatsapp(number, message):

    try:

        client.messages.create(

            body=message,

            from_=FROM_WHATSAPP,

            to="whatsapp:+91" + str(number)

        )

        print("WhatsApp Sent")

        return True

    except Exception as e:

        print(e)

        return False