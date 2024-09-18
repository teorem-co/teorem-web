import IQuestionArticle from '../types/IQuestionArticle';

const QUESTION_ARTICLES: Record<string, { US: IQuestionArticle[]; HR: IQuestionArticle[] }> = {
    SUBJECTS: {
        US: [
            {
                title: 'How to Choose and List Your Tutoring Subjects to Stand Out',
                description:
                    'Learn how to choose and list your tutoring subjects effectively to attract the right students and stand out in our marketplace.',
                link: 'https://intercom.help/teorem/en/articles/9876267-how-to-choose-and-list-your-tutoring-subjects-to-stand-out',
            },
        ],
        HR: [
            {
                title: 'Kako odabrati i navesti svoje predmete podučavanja da bi se istaknuli',
                description:
                    'Naučite kako učinkovito odabrati i navesti svoje predmete kako bi privukli prave učenike i istaknuli se na našoj stranici.',
                link: 'https://intercom.help/teorem/hr/articles/9876267-kako-odabrati-i-navesti-svoje-predmete-poducavanja-da-bi-se-istaknuli',
            },
        ],
    },
    AVAILABILITY: {
        US: [
            {
                title: 'Setting Your Availability to Match with More Students',
                description:
                    "Set your availability to match with students' schedules and adjust it anytime to suit your changing needs.",
                link: 'https://intercom.help/teorem/en/articles/9876274-setting-your-availability-to-match-with-more-students',
            },
        ],
        HR: [
            {
                title: 'Postavljanje Vaše dostupnosti za više učenika',
                description:
                    'Postavite svoju dostupnost tako da odgovara rasporedu učenika i prilagodite je u bilo kojem trenutku.',
                link: 'https://intercom.help/teorem/hr/articles/9876274-postavljanje-vase-dostupnosti-za-vise-ucenika',
            },
        ],
    },
    PHOTO: {
        US: [
            {
                title: "Why Adding a Photo Can Boost Your Profile's Success",
                description:
                    'Adding a photo to your profile helps build trust, increases booking chances, and makes you more approachable to students.',
                link: 'https://intercom.help/teorem/en/articles/9877394-why-adding-a-photo-can-boost-your-profile-s-success',
            },
        ],
        HR: [
            {
                title: 'Zašto dodavanje fotografije može poboljšati uspjeh Vašeg profila',
                description:
                    'Dodavanje fotografije na Vaš profil pomaže u izgradnji povjerenja, povećava šanse za rezervaciju i čini Vas pristupačnijim studentima.',
                link: 'https://intercom.help/teorem/hr/articles/9877394-zasto-dodavanje-fotografije-moze-poboljsati-uspjeh-vaseg-profila',
            },
        ],
    },
    EDUCATION: {
        US: [
            {
                title: 'Why Your Education Background Matters to Parents and Students',
                description:
                    'Your education is a critical factor that parents and students consider. It shows your expertise and builds trust in your tutoring abilities.',
                link: 'https://intercom.help/teorem/en/articles/9877432-why-your-education-background-matters-to-parents-and-students',
            },
        ],
        HR: [
            {
                title: 'Zašto je Vaše obrazovanje važno roditeljima i učenicima',
                description:
                    'Vaše obrazovanje ključni je faktor koji roditelji i učenici uzimaju u obzir. To pokazuje Vašu stručnost i sliku o sposobnosti podučavanja.',
                link: 'https://intercom.help/teorem/hr/articles/9877432-zasto-je-vase-obrazovanje-vazno-roditeljima-i-ucenicima',
            },
        ],
    },
    TITLE: {
        US: [
            {
                title: 'Crafting a Compelling Profile Title to Attract Students',
                description:
                    'Create a clear, compelling profile title that highlights your expertise and grabs attention to increase your chances of being booked.',
                link: 'https://intercom.help/teorem/en/articles/9877651-crafting-a-compelling-profile-title-to-attract-students',
            },
        ],
        HR: [
            {
                title: 'Osmišljavanje upečatljivog naslova profila za privlačenje učenika',
                description:
                    'Stvorite jasan, uvjerljiv naslov profila koji ističe Vašu stručnost i privlači pažnju kako biste povećali šanse da budete rezervirani.',
                link: 'https://intercom.help/teorem/hr/articles/9877651-osmisljavanje-upecatljivog-naslova-profila-za-privlacenje-ucenika',
            },
        ],
    },
    DESCRIPTION: {
        US: [
            {
                title: 'Crafting a Short and Impactful Profile Description',
                description:
                    'Write a concise description showcasing your expertise and teaching style, and encourage students to watch your video for more details.',
                link: 'https://intercom.help/teorem/en/articles/9877654-crafting-a-short-and-impactful-profile-description',
            },
        ],
        HR: [
            {
                title: 'Izrada kratkog i dojmljivog opisa profila',
                description:
                    'Napišite sažeti opis koji prikazuje Vašu stručnost i stil poučavanja te potaknite učenike da pogledaju Vaš video za više detalja.',
                link: 'https://intercom.help/teorem/hr/articles/9877654-izrada-kratkog-i-dojmljivog-opisa-profila',
            },
        ],
    },
    VIDEO: {
        US: [
            {
                title: 'Why Your 1-Minute Video is Key to Building Trust and Securing Bookings',
                description:
                    'Your video is crucial in building trust with parents and students, helping you stand out and making the next step towards booking easier.',
                link: 'https://intercom.help/teorem/en/articles/9877657-why-your-1-minute-video-is-key-to-building-trust-and-securing-bookings',
            },
        ],
        HR: [
            {
                title: 'Zašto je Vaš 1-minutni video ključ za izgradnju povjerenja i osiguravanje rezervacija',
                description:
                    'Vaš je video ključan u izgradnji povjerenja kod roditelja i učenika, pomaže Vam da se istaknete i olakšava sljedeći korak prema rezervaciji.',
                link: 'https://intercom.help/teorem/hr/articles/9877657-zasto-je-vas-1-minutni-video-kljuc-za-izgradnju-povjerenja-i-osiguravanje-rezervacija',
            },
        ],
    },
    NOTIFICATION: {
        US: [
            {
                title: 'How to Choose Between Instant Book and Approve Requests for Bookings',
                description:
                    'Instant Book ranks you higher and speeds up the booking process, but Approve Requests offers flexibility if your schedule is unpredictable.',
                link: 'https://intercom.help/teorem/en/articles/9877672-how-to-choose-between-instant-book-and-approve-requests-for-bookings',
            },
        ],
        HR: [
            {
                title: 'Kako odabrati između Instant Book i odobravanja zahtjeva za rezervacije',
                description:
                    'Instant Book Vas rangira više i ubrzava proces rezervacije, ali odobravanje zahtjeva nudi fleksibilnost ako je Vaš raspored nepredvidiv.',
                link: 'https://intercom.help/teorem/hr/articles/9877672-kako-odabrati-izmedu-instant-book-i-odobravanja-zahtjeva-za-rezervacije',
            },
        ],
    },
    PRICE: {
        US: [
            {
                title: 'How to Set the Right Price to Build Your Client Base and Grow Your Tutoring Business',
                description:
                    'Start with a lower price to attract clients and gain reviews, then gradually increase your rate as you grow your reputation and demand.',
                link: 'https://intercom.help/teorem/en/articles/9877683-how-to-set-the-right-price-to-build-your-client-base-and-grow-your-tutoring-business',
            },
        ],
        HR: [
            {
                title: 'Kako postaviti pravu cijenu da izgradite svoju bazu klijenata i razvijete svoj posao instrukcija',
                description:
                    'Započnite s nižom cijenom kako biste privukli klijente i dobili recenzije, a zatim postupno povećavajte cijenu kako raste potražnja za Vama.',
                link: 'https://intercom.help/teorem/hr/articles/9877683-kako-postaviti-pravu-cijenu-da-izgradite-svoju-bazu-klijenata-i-razvijete-svoj-posao-instrukcija',
            },
        ],
    },
    ENTITY: {
        US: [
            {
                title: 'Setting Up Your Account—Are You Tutoring as a Private Individual or a Business?',
                description:
                    "Decide whether you're tutoring as a private individual or business, and learn how Stripe’s KYC/AML processes ensure secure payments.",
                link: 'https://intercom.help/teorem/en/articles/9877690-setting-up-your-account-are-you-tutoring-as-a-private-individual-or-a-business',
            },
        ],
        HR: [
            {
                title: 'Postavljanje Vašeg računa — podučavate li kao privatna osoba ili tvrtka?',
                description:
                    'Odaberite podučavate li kao privatna osoba ili tvrtka i saznajte kako Stripe KYC/AML procesi osiguravaju sigurna plaćanja.',
                link: 'https://intercom.help/teorem/hr/articles/9877690-postavljanje-vaseg-racuna-poducavate-li-kao-privatna-osoba-ili-tvrtka',
            },
        ],
    },
    LEGAL_INFO: {
        US: [
            {
                title: 'Why We Need the Last 4 Digits of Your Social Security Number',
                description:
                    'Stripe requires the last 4 digits of your SSN for identity verification and compliance, while Teorem never handles or stores this info.',
                link: 'https://intercom.help/teorem/en/articles/9877696-why-we-need-the-last-4-digits-of-your-social-security-number',
            },
        ],
        HR: [
            {
                title: 'Zašto nam je potreban Vaš OIB',
                description:
                    'Stripe Vaš OIB za provjeru identiteta i usklađenost, dok Teorem nikada ne obrađuje niti pohranjuje ove informacije.',
                link: 'https://intercom.help/teorem/hr/articles/9877696-zasto-nam-je-potreban-vas-oib',
            },
        ],
    },
    LEGAL_INFO_COMPANY: {
        US: [
            {
                title: 'Why We Need Your Company Name and Taxpayer ID for Secure Payments',
                description:
                    'Stripe requires your company name and taxpayer ID to verify your business, ensure secure payments, and comply with financial regulations.',
                link: 'https://intercom.help/teorem/en/articles/9877711-why-we-need-your-company-name-and-taxpayer-id-for-secure-payments',
            },
        ],
        HR: [
            {
                title: 'Zašto nam treba naziv Vaše tvrtke i porezni broj za sigurna plaćanja',
                description:
                    'Stripe zahtijeva naziv Vaše tvrtke i porezni broj za provjeru Vašeg poslovanja, sigurna plaćanja i usklađenost s financijskim propisima.',
                link: 'https://intercom.help/teorem/hr/articles/9877711-zasto-nam-treba-naziv-vase-tvrtke-i-porezni-broj-za-sigurna-placanja',
            },
        ],
    },
    PAYOUT_INFO: {
        US: [
            {
                title: 'Setting Up Your Bank Account for Secure Payouts',
                description:
                    'Provide your bank account details for secure payouts, and remember, you can update your information later if needed.',
                link: 'https://intercom.help/teorem/en/articles/9877720-setting-up-your-bank-account-for-secure-payouts',
            },
        ],
        HR: [
            {
                title: 'Postavljanje Vašeg bankovnog računa za sigurne isplate',
                description:
                    'Navedite podatke o svom bankovnom računu za sigurne isplate i zapamtite da svoje podatke možete ažurirati kasnije ako je potrebno.',
                link: 'https://intercom.help/teorem/hr/articles/9877720-postavljanje-vaseg-bankovnog-racuna-za-sigurne-isplate',
            },
        ],
    },
    ADDRESS: {
        US: [
            {
                title: 'Why We Need Your Address for Secure and Compliant Payments',
                description:
                    'Your address helps Stripe verify your identity and comply with financial regulations, ensuring secure and compliant payouts.',
                link: 'https://intercom.help/teorem/en/articles/9877721-why-we-need-your-address-for-secure-and-compliant-payments',
            },
        ],
        HR: [
            {
                title: 'Zašto nam treba Vaša adresa za sigurna i usklađena plaćanja',
                description:
                    'Vaša adresa pomaže Stripeu potvrditi Vaš identitet i uskladiti se s financijskim propisima, osiguravajući sigurne i usklađene isplate.',
                link: 'https://intercom.help/teorem/hr/articles/9877721-zasto-nam-treba-vasa-adresa-za-sigurna-i-uskladena-placanja',
            },
        ],
    },
    PHONE: {
        US: [
            {
                title: 'Why We Need Your Phone Number for Secure Payments and Verification',
                description:
                    'Confirm your phone number for secure identity verification and payout protection, and rest assured it’s used only for account security.',
                link: 'https://intercom.help/teorem/en/articles/9877725-why-we-need-your-phone-number-for-secure-payments-and-verification',
            },
        ],
        HR: [
            {
                title: 'Zašto nam treba vaš telefonski broj za sigurno plaćanje i provjeru',
                description:
                    'Potvrdite svoj telefonski broj za sigurnosnu potvrdu identiteta i isplate, i budite uvjereni da se koristi samo za sigurnost Vašeg računa.',
                link: 'https://intercom.help/teorem/hr/articles/9877725-zasto-nam-treba-vas-telefonski-broj-za-sigurno-placanje-i-provjeru',
            },
        ],
    },
};

export default QUESTION_ARTICLES;
