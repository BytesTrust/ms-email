'use strict';

const pug = require('pug');

const config = require("../config/env.config");
const sendEmail = require("../helpers/sendEmail.helper");

const {ContentNotFoundError, LanguageNotFoundError} = require("../errors/notFound.error")

const compiledTheme = pug.compileFile('./src/emails/themes/default/theme.pug');

const availableContents = {
    "confirm-email": {
        "en-US": pug.compileFile('./src/emails/types/confirm-email/confirm-email.en-US.pug'),
        "pt-BR": pug.compileFile('./src/emails/types/confirm-email/confirm-email.pt-BR.pug')
    }
}

function getEmail(content, language="en-US", locals){

    if (!availableContents[content]) {
        throw new ContentNotFoundError();
    }

    if (!availableContents[content][language]) {
        throw new LanguageNotFoundError();;
    }

    const compiledContent = availableContents[content][language];

    locals.appName= config.appName;
    locals.appSupportName= config.appSupportName;
    locals.appSupportEmail= config.appSupportEmail;

    const html = compiledTheme({
        content: compiledContent(locals)
    });

    return html;
}

exports.view = (req, res, next) => {

    const html = getEmail(req.params.type, req.locale.toString(), {
        // email: "teste@tete.com",
        // confirmationUrl: "https://www.google.com.br",
    });

    res.set('Content-Type', 'text/html');

    res.status(200).send(html);
}

exports.confirmEmail = (req, res, next) => {

    const html = getEmail("confirm-email", req.locale.toString(), {
        email: req.body.email,
        confirmationUrl: req.body.confirmationUrl,
    });

    sendEmail(req.body.email, {
       subject: req.polyglot.t("subjectConfirmEmail"),
       content: html
    }).then((info) =>{
        res.status(200).send(info);
    }).catch((error) => {
        return next(error);
    });
}
