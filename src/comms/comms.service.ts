import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class CommsService {
    private twilioClient: Twilio;
    private serviceSid = "VA32282dfb9d7e90c88c38fa5450a2a995";
    constructor(
    ) {
        this.twilioClient = new Twilio("ACc995c848c0f5c8903a53dabda3f70431", "dc4f4cf9601e75dd00f30b071645b329");
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