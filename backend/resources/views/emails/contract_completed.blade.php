<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Complete Contract</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">

    <div style="background-color: #ffffff; margin: 20px auto; padding: 20px; max-width: 600px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">

        <h1 style="color: #333;">Congratulation, Your Contract Has Been Completed!</h1>
        <p> ( {{ $mail['contract']['title'] }} )</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Title:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">{{ $mail['contract']['title'] }}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Contract Fees:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">{{ $mail['contract']['fees_amount'] }}</td>
            </tr>

            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Platfrom Fees:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">{{ $mail['platform_fees'] }}</td>
            </tr>

            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Lawyer Fees:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">{{ $mail['lawyer_fees'] }}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Start Date:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">{{ $mail['contract']['start_date'] }}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Lawyer:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                    <p style='margin:0'>
                        {{ $mail['contract']['lawyer']['first_name'] . ' ' . $mail['contract']['lawyer']['last_name'] }}
                    </p>
                    <span> {{ $mail['contract']['lawyer']['email'] }} </span>
                </td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Client:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                    <p style='margin:0'>
                        {{ $mail['contract']['client']['first_name'] . ' ' . $mail['contract']['client']['last_name'] }}
                    </p>
                    <span> {{ $mail['contract']['client']['email'] }} </span>
                </td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Feedback:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                    <p style='margin:0'> {{ $mail['rating']['feedback'] }} </p>
                    <span style="color:#ED8A19; font-size: 30px;font-weight:700;">{{ $mail['rating']['rating'] }}
                        &#9733;
                    </span>


                </td>
            </tr>
            <!-- Add more contract details here -->
        </table>
        <a href="https://nbundl.com/dashboard/contract-details/{{$mail['contract']['id']}}" target="_blank" style="display:block;color: #000;padding:5px 10px;border-radius:5px;background: #DD995F;width: fit-content;text-decoration: none;margin-top: 15px;">
            View Details
        </a>

        <p style="margin-top: 20px;">Thank you for using our services!</p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <p style="color: #888; font-size: 12px;">This email is automatically generated. Please do not reply.</p>
    </div>

</body>

</html>