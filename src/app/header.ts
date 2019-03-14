import * as Nation1 from 'src/app/data/nation1.json';
import * as Nation2 from 'src/app/data/nation2.json';
import * as Nation3 from 'src/app/data/nation3.json';

export class HEADER {

    // Message Type
    public static readonly MSGTYPE: any = {
        SGU_REQ: 101, SGU_RSP: 102,
        UVC_REQ: 103, UVC_RSP: 104,
        SGI_REQ: 105, SGI_RSP: 106,
        SGO_NOT: 107, SGO_ACK: 108,
        UPC_REQ: 109, UPC_RSP: 110,
        FPU_REQ: 111, FPU_RSP: 112,
        UDR_REQ: 113, UDR_RSP: 114,
        AUV_REQ: 115, AUV_RSP: 116,
        ASR_REQ: 117, ASR_RSP: 118,
        ASD_REQ: 119, ASD_RSP: 120,
        ASV_REQ: 121, ASV_RSP: 122,
        SRG_REQ: 123, SRG_RSP: 124,
        SAS_REQ: 125, SAS_RSP: 126,
        SDD_REQ: 127, SDD_RSP: 128,
        SLV_REQ: 129, SLV_RSP: 130,
        RAV_REQ: 131, RAV_RSP: 132,
        RHV_REQ: 133, RHV_RSP: 134,
        HAV_REQ: 135, HAV_RSP: 136,
        SHR_REQ: 137, SHR_RSP: 138,
        HHV_REQ: 139, HHV_RSP: 140,
        KAS_REQ: 141, KAS_RSP: 142,

    }

    // Timer (ms)
    public static readonly TIMER: any = {
        T401: 5000, T402: 5000,
        T403: 5000, T404: 5000,
        T405: 5000, T406: 5000,
        T407: 5000, T408: 5000,
        T409: 5000, T410: 5000,
        T411: 5000, T422: 5000,
        T413: 5000, T414: 5000,
        T415: 5000, T416: 5000,
        T417: 5000, T418: 5000,
        T419: 5000, T420: 5000,
        T421: 500,

        /**
         * T551: 300,000 ms
         * T552: 30,000,000 ms
         */
        T551: 300000, T552: 3600000,
        T553: 10000, T554: 10000,
    }

    // Retrive
    public static readonly RETRIVE = {
        R401: 5, R402: 5,
        R403: 5, R404: 5,
        R405: 5, R406: 5,
        R407: 5, R408: 5,
        R409: 5, R410: 5,
        R411: 5, R412: 5,
        R413: 5, R414: 5,
        R415: 5, R416: 5,
        R417: 5, R418: 5,
        R419: 5, R420: 5,
        R421: 5,
    }

    // Operator
    public static readonly OPERATOR = {
        and: 0b00,
        or: 0b01,
        not: 0b10

    }

    // Google maps API key
    public static readonly GOOGLE_MAP_API_KEY = "AIzaSyBzlpsKxfTFKZBYHTM-hOGltSeCUHMYfw4";

    // Message validation
    public static readonly HEADER_SIZE: number = 6;

    // Default value
    public static readonly NULL_VALUE = null;
    public static readonly EMPTY_VALUE: number = 0;
    public static readonly RES_SUCCESS: boolean = true;
    public static readonly RES_FAILD: boolean = false;
    public static readonly EXIST_SENSORS: number = 0;
    public static readonly NOT_EXIST_SENSORS: number = 1;
    public static readonly OWN_SENSOR: number = 0;
    public static readonly COMMUNITY_SENSORS: number = 1;
    public static readonly LAST_FRAGMENT: number = 1;
    public static readonly EXTENDED_DATA_SIZE: number = 255;
    public static readonly HEART_RELATED_DATA_LIST_TYPE: number = 1;
    public static readonly EXTENDED_HEART_RELATED_DATA_LIST_TYPE: number = 2;
    public static readonly SENSOR_INFORMATION_LIST_TYPE: number = 1;
    public static readonly EXTENDED_SENSOR_INFORMATION_LIST_TYPE: number = 2;
    public static readonly TIMESTAMP_SIZE: number = 4;
    public static readonly ANONYMOUS_USER_SEQUENCENUMBER: number = 0X00000000;

    // Global variable
    public static GLOBAL: any = {
        CURRENT_STATE: 0,
        NUMBER_OF_SIGNED_IN_COMPLETIONS: 0,
        USER_SEQUENCE_NUMBER: 0,
    }

    // Result code
    public static readonly RESCODE_SWP_SGU: any = {
        OK: 0, OTHER: 1, CONFLICT_OF_TEMPORARY_CLIENT_ID: 2, DUPLICATE_OF_USER_ID: 3,
    }
    public static readonly RESCODE_SWP_UVC: any = {
        OK: 0, OTHER: 1, DUPLICATE_OF_USER_ID: 2, NOT_EXIST_TEMPORARY_CLIENT_ID: 3, INCORRECT_AUTHENTICATION_CODE: 4,
    }
    public static readonly RESCODE_SWP_SGI: any = {
        OK: 0, OTHER: 1, CONFLICT_OF_TEMPORARY_CLIENT_ID: 2, NOT_EXIST_USER_ID: 3, INCORRECT_CURRENT_USER_PASSWORD: 4,
    }
    public static readonly RESCODE_SWP_SGO: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3,
    }
    public static readonly RESCODE_SWP_UPC: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3, INCORRECT_CURRENT_USER_PASSWORD: 4,
    }
    public static readonly RESCODE_SWP_FPU: any = {
        OK: 0, OTHER: 1, CONFLICT_OF_TEMPORARY_CLIENT_ID: 2, INCORRECT_USER_INFORMATION: 3, NOT_EXIST_USER_ID: 4,
    }
    public static readonly RESCODE_SWP_UDR: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3, INCORRECT_CURRENT_USER_PASSWORD: 4,
    }
    public static readonly RESCODE_SWP_AUV: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3, UNAUTHORIZED_USER_SEQUENCE_NUMBER: 4,
    }
    public static readonly RESCODE_SWP_ASR: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3, UNAUTHORIZED_USER_SEQUENCE_NUMBER: 4,
    }
    public static readonly RESCODE_SWP_ASD: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3, UNAUTHORIZED_USER_SEQUENCE_NUMBER: 4, NOT_EXIST_WIFI_MAC_ADDRESS: 5, NOT_EXIST_USER_ID: 6, NOT_ASSOCIATED_WITH_USER_ID: 7,
    }
    public static readonly RESCODE_SWP_ASV: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3, UNAUTHORIZED_USER_SEQUENCE_NUMBER: 4,
    }
    public static readonly RESCODE_SWP_SRG: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3,
    }
    public static readonly RESCODE_SWP_SAS: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3, NOT_EXIST_WIFI_MAC_ADDRESS: 4, ALREADY_ASSOCIATED: 5,
    }
    public static readonly RESCODE_SWP_SDD: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3, NOT_EXIST_WIFI_MAC_ADDRESS: 4, NOT_ASSOCIATED_WITH_USER_ID: 5,
    }
    public static readonly RESCODE_SWP_SLV: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3,
    }
    public static readonly RESCODE_SWP_RAV: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3,
    }
    public static readonly RESCODE_SWP_RHV: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3,
    }
    public static readonly RESCODE_SWP_HAV: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3, UNAUTHORIZED_USER_SEQUENCE_NUMBER: 4, NOT_EXIST_SENSORS: 5,
    }
    public static readonly RESCODE_SWP_SHR: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3,
    }
    public static readonly RESCODE_SWP_HHV: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3, UNAUTHORIZED_USER_SEQUENCE_NUMBER: 4,
    }
    public static readonly RESCODE_SWP_KAS: any = {
        OK: 0, OTHER: 1, UNALLOCATED_USER_SEQUENCE_NUMBER: 2, INCORRECT_NUMBER_OF_SIGNED_IN_COMPLETIONS: 3,
    }

    // State machines
    public static readonly STATE_SWP: any = {
        IDLE_STATE: 0, USER_DUPLICATE_REQUESTED_STATE: 1, HALF_USN_ALLOCATE_STATE: 2, HALF_USN_INFORMED_STATE: 3, USN_INFORMED_STATE: 4, HALF_IDLE_STATE: 5
    }

    public static CURRENT_STATE: number = 0;
    public static KAS_IN_INTERVAL: boolean = false;

    // Routes
    public static readonly ROUTER_PATHS = {
        SIGN_UP: '/signup', SIGN_IN: '/signin', VERIFYING_UVC: '/signup-code', FORGOT_PW: '/forgot-pw',
        COMMON_USER_DASHBOARD: '/dashboard', COMMON_USER_CHANGE_PW: '/dashboard/changepw', COMMON_USER_DEREGISTER_ACCOUNT: '/dashboard/deregister-account', COMMON_USER_SENSOR_LIST: '/dashboard/sensor-list', COMMON_USER_PERSONAL_SENSOR_MANAGEMENT: 'dashboard/personal-sensor-management', COMMON_USER_AIR_HISTORY: '/dashboard/air-history', COMMON_USER_HEART_HISTORY: '/dashboard/heart-history', COMMON_USER_SENSOR_HISTORY: 'dashboard/sensor-history',
        ADMIN_DASHBOARD: '/administrator', ADMIN_CHANGE_PW: '/administrator/changepw', ADMIN_DEREGISTER_ACCOUNT: '/administrator/deregister-account', ADMIN_SENSOR_LIST: '/administrator/sensor-list', ADMIN_PERSONAL_SENSOR_MANAGEMENT: '/administrator/personal-sensor-management', ADMIN_AIR_HISTORY: '/administrator/air-history', ADMIN_HEART_HISTORY: '/administrator/heart-history', ADMIN_ALL_SENSORS_MANAGEMENT: '/administrator/admin-sensor-management', ADMIN_ALL_USERS_MANAGEMENT: '/administrator/admin-user-management', ADMIN_SENSOR_HISTORY: 'administrator/sensor-history',
        MAIN_PAGE: '/', MAIN_SOLUTIONS_PAGE: '/solutions', MAIN_TECHNOLOGY_PAGE: '/technology', MAIN_INTRODUCTION_PAGE: '/introduction',
    };

    // Nation data
    public static NATIONS = [
        [
            "Afghanistan", "Ã…land Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia (Plurinational State of)", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo (Democratic Republic of the)", "Cook Islands", "Costa Rica", "CÃ´te d\'Ivoire", "Croatia", "Cuba", "CuraÃ§ao", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (Democratic People\'s Republic of)", "Korea (Republic of)", "Kuwait", "Kyrgyzstan", "Lao People\'s Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia (the former Yugoslav Republic of)", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia (Federated States of)", "Moldova (Republic of)", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine, State of", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "RÃ©union", "Romania", "Russian Federation", "Rwanda", "Saint BarthÃ©lemy", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom of Great Britain and Northern Ireland", "United States of America", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela (Bolivarian Republic of)", "Viet Nam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"
        ],
        Nation1, Nation2, Nation3
    ];
}
