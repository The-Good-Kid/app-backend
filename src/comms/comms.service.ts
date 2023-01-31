import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class CommsService {
    private twilioClient: Twilio;
    private serviceSid = "************";
    constructor(
    ) {
        this.twilioClient = new Twilio("***", "**");
    }

    async initiatePhoneNumberVerification(phoneNumber: string) {

        return await this.twilioClient.verify.services(this.serviceSid)
            .verifications
            .create({ to: '+91' + phoneNumber, channel: 'sms' })
    }

    // ...

    async sendMessage(receiverPhoneNumber: string, message: string) {
        const senderPhoneNumber = '+917080320488';

        return this.twilioClient.messages
            .create({ body: message, from: senderPhoneNumber, to: receiverPhoneNumber })
    }

    async verifyPhoneNumber(contact_number: string, verificationCode: string) {
        try {
            return await this.twilioClient.verify.services(this.serviceSid)
                .verificationChecks
                .create({ to: '+91' + contact_number, code: verificationCode })
        } catch (e) {
            throw e;
        }
    }

    // create a function to send "hello world" message to a phone number


}