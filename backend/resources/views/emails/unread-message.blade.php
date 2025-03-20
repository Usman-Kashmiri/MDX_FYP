<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Unread Message from {{ $data['sender_name'] }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
        /**
   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
   */
        @media screen {
            @font-face {
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 400;
                src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
            }

            @font-face {
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 700;
                src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
            }
        }

        /**
   * Avoid browser level font resizing.
   * 1. Windows Mobile
   * 2. iOS / OSX
   */
        body,
        table,
        td,
        a {
            -ms-text-size-adjust: 100%;
            /* 1 */
            -webkit-text-size-adjust: 100%;
            /* 2 */
        }

        /**
   * Remove extra space added to tables and cells in Outlook.
   */
        table,
        td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
        }

        /**
   * Better fluid images in Internet Explorer.
   */
        img {
            -ms-interpolation-mode: bicubic;
        }

        /**
   * Remove blue links for iOS devices.
   */
        a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
        }

        /**
   * Fix centering issues in Android 4.4.
   */
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }

        body {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /**
   * Collapse table borders to avoid space between cells.
   */
        table {
            border-collapse: collapse !important;
        }

        a {
            color: #1a82e2;
        }

        img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
        }
    </style>

</head>

<body style="background-color: #e9ecef;">

    <!-- start body -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%">

        <!-- start logo -->
        <tr>
            <td align="center" bgcolor="#e9ecef">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 36px 24px;">
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <!-- end logo -->

        <!-- start hero -->
        <tr>
            <td align="center" bgcolor="#e9ecef">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 36px 0 0 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
                            <a href='https://nbundl.com/' style="display:flex; gap:10px; align-items: center; color: black; text-decoration: none;">
                                <img style="margin-right:8px; border-radius:4px; display:inline-block; width:42px; height:42px" src="{{$data['site_logo']}}" />
                                <h1 style="font-size: 1.5rem; margin: 4px 0;">{{$data['site_name']}}</h1>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 28px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
                            <h2 style="margin: 0; font-size: 30px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">You have a new unread direct message.</h2>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <!-- end hero -->

        <!-- start copy block -->
        <tr>
            <td align="center" bgcolor="#e9ecef">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                    <!-- start copy -->
                    <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 20px 0 16px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                            <h4 style="margin: 0;">From your conversion with <b><a href="{{$data['link']}}" style="color: black;" target="_blank">{{ $data['sender_name'] }}</a></b></h4>
                        </td>
                    </tr>
                    <!-- end copy -->

                    <!-- start button -->
                    <tr>
                        <td align="left" bgcolor="#ffffff">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <table style="min-width: 65%;" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="border-radius: 6px;">
                                                    <div style="display:flex; gap:6px; width: 100%;">
                                                        <img style="margin-right:8px; border-radius:4px; display:inline-block; width:42px; height:42px" src="{{ $data['sender_image'] }}" />
                                                        <div style="width: 100%;">
                                                            <div style="display:flex; margin: 0 0 3px 0;">
                                                                <a href="{{$data['link']}}" style="color: black;" target="_blank">
                                                                    <h4 style="margin:0 20px 0 0;">{{ $data['sender_name'] }}</h4>
                                                                </a>
                                                                <span>{{$data['time_stamp']}}</span>
                                                            </div>
                                                            <p style="text-align: start; margin-top: 0;">{{$data['message']}}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="font-size:1rem; padding: 15px 0 50px;">
                                                    <a href="{{$data['link']}}" target="_blank">Click here to redirect to your inbox</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- end button -->
                </table>
            </td>
        </tr>
        <!-- end copy block -->

        <!-- start footer -->
        <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                    <!-- start thanks note -->
                    <tr>
                        <td align="center" bgcolor="#e9ecef" style="padding: 0px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                            <p style="margin: 0;">Thank you for using our services!</p>
                        </td>
                    </tr>
                    <!-- end thanks note -->

                    <!-- start do not reply note -->
                    <tr>
                        <td align="center" bgcolor="#e9ecef" style="padding: 0px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                            <p style="margin: 0;">This email is automatically generated. Please do not reply!</p>
                        </td>
                    </tr>
                    <!-- end do not reply note -->
                </table>
            </td>
        </tr>
        <!-- end footer -->
    </table>
    <!-- end body -->

</body>

</html>