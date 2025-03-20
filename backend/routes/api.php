<?php

use App\Http\Controllers\Auth\AllAuthController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\Client\AppointmentController;
use App\Http\Controllers\Client\ChatController;
use App\Http\Controllers\Client\DashboardController as ClientDashboardController;
use App\Http\Controllers\Lawyer\CaseController;
use App\Http\Controllers\SuperAdmin\AdminController;
use App\Http\Controllers\SuperAdmin\AreaExpertiseController;
use App\Http\Controllers\SuperAdmin\BlogsController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperAdminDashboardController;
use App\Http\Controllers\SuperAdmin\JurisdictionController;
use App\Http\Controllers\SuperAdmin\LawyerController;
use App\Http\Controllers\SuperAdmin\ClientController;
use App\Http\Controllers\Website\AllController;
use App\Http\Controllers\Lawyer\DashboardController as LawyerDashboardController;
use App\Http\Controllers\Lawyer\LawyersAppointmentController;
use App\Http\Controllers\Lawyer\LawyersAvailabilityController;
use App\Http\Controllers\Lawyer\LawyersChatController;
use App\Http\Controllers\Lawyer\TimeSlotController;
use App\Http\Controllers\Lawyer\ContractController;
use App\Http\Controllers\Client\ContractController as ClientContractController;
use App\Http\Controllers\Client\MeetingController as ClientMeetingController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Lawyer\MilestoneController;
use App\Http\Controllers\Lawyer\WithdrawRequestController;
use App\Http\Controllers\SuperAdmin\ContractController as AdminContractController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SuperAdmin\CarouselController;
use App\Http\Controllers\SuperAdmin\CategoriesController;
use App\Http\Controllers\SuperAdmin\ContactUsController;
use App\Http\Controllers\SuperAdmin\FAQsController;
use App\Http\Controllers\SuperAdmin\NewsletterController;
use App\Http\Controllers\SuperAdmin\TagsController;
use App\Http\Controllers\SuperAdmin\WebsiteSettingsController;
use App\Http\Controllers\TransactionsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// * Pusher
Route::post('/pusher/auth', [AuthController::class, 'authenticatePusher']);

// * Auth APIs Start
Route::group(['prefix' => "auth", 'middleware' => ['api']], function () {
    Route::post('login', [AllAuthController::class, 'login'])->name('login');
    Route::get('/user/{status}', [AllAuthController::class, 'updateOnlineStatus']);
    Route::post('register', [AllAuthController::class, 'register']);
    Route::post('register-with', [AllAuthController::class, 'register_with']);
    Route::post('login-with', [AllAuthController::class, 'login_with']);
    Route::post('update-client', [AllAuthController::class, 'update_client']);
    Route::post('update-lawyer', [AllAuthController::class, 'update_lawyer']);
    Route::post('verify-email', [AllAuthController::class, 'verify_email']);
    Route::post('resend-verify-email', [AllAuthController::class, 'resend_verify_email']);
    Route::post('reset-password', [AllAuthController::class, 'reset_password']);
    Route::post('forgot-password', [AllAuthController::class, 'forgot_password']);
    Route::get('refresh', [AllAuthController::class, 'refresh']);
    Route::get('logout', [AllAuthController::class, 'logout']);
    Route::get('user-profile', [AllAuthController::class, 'user_detail']);
    Route::put("/deactivate-account", [AllAuthController::class, 'deactivate_account']);
});
// * Auth APIs End


// * Super Admin APIs Start
Route::group(["prefix" => "super-admin", "middleware" => ["auth:api", "isSuperAdmin"]], function () {

    // SuperAdmin Dashboard Start  
    Route::get('/dashboard', [SuperAdminDashboardController::class, 'index']);
    Route::get('/chart-data', [SuperAdminDashboardController::class, 'chart_data']);
    Route::get('/all-countries', [SuperAdminDashboardController::class, 'countries']);
    Route::post('/update-country-status/{id}', [SuperAdminDashboardController::class, 'update_country_status']);
    Route::post('/profile-pic', [SuperAdminDashboardController::class, 'profileimage']);
    Route::post('/personal-information', [SuperAdminDashboardController::class, 'personal_info']);
    Route::post('/address-detail', [SuperAdminDashboardController::class, 'address_info']);
    Route::post('/update-profile/{id}', [SuperAdminDashboardController::class, 'update']);
    Route::post('/change-password', [SuperAdminDashboardController::class, 'update_password']);
    Route::get("/user-stats/{id}", [SuperAdminDashboardController::class, 'user_complete_stats']);
    Route::get('/notifications', [NotificationsController::class, 'index']);
    Route::delete('/notification/{id}', [NotificationsController::class, 'destroy']);
    Route::put('/notification/{id}', [NotificationsController::class, 'mark_as_read']);
    // SuperAdmin Dashboard End

    // Contracts Start
    Route::group(["prefix" => "contracts"], function () {
        Route::get('/list/{status}', [AdminContractController::class, 'list']);
        Route::get("/show/{id}", [AdminContractController::class, 'show']);
    });
    // Contracts End

    // Withdraw Request Start
    Route::group(["prefix" => "withdraw-request"], function () {
        Route::get("/list", [SuperAdminDashboardController::class, 'withdraw_request_list']);
        Route::post("/update/{id}", [SuperAdminDashboardController::class, 'withdraw_request_update_status']);
    });
    // Withdraw Request End

    // Website Settings Routes Start
    Route::group(["prefix" => "website-settings"], function () {
        Route::get("/show", [WebsiteSettingsController::class, 'index']);
        Route::post("/update", [WebsiteSettingsController::class, 'update']);
    });
    // Website Settings Routes End

    // Area Of Expertise Started
    Route::group(["prefix" => "area-expertise"], function () {
        Route::get("/list", [AreaExpertiseController::class, 'index']);
        Route::post("/create", [AreaExpertiseController::class, 'store']);
        Route::post("/update/{id}", [AreaExpertiseController::class, 'update']);
        Route::get("/destroy/{id}", [AreaExpertiseController::class, 'destroy']);
        Route::get("/detail/{id}", [AreaExpertiseController::class, 'show']);
    });
    // Area Of Expertise End

    // Jurisdictions Start
    Route::group(["prefix" => "jurisdiction"], function () {
        Route::get("/list", [JurisdictionController::class, 'index']);
        Route::post("/create", [JurisdictionController::class, 'store']);
        Route::post("/update/{id}", [JurisdictionController::class, 'update']);
        Route::get("/destroy/{id}", [JurisdictionController::class, 'destroy']);
        Route::get("/detail/{id}", [JurisdictionController::class, 'show']);
    });
    // Jurisdictions End

    // Admins Start
    Route::group(["prefix" => "admin"], function () {
        Route::get("/list", [AdminController::class, 'index']);
        Route::post("/create", [AdminController::class, 'store']);
        Route::post("/update/{id}", [AdminController::class, 'update']);
        Route::get("/destroy/{id}", [AdminController::class, 'destroy']);
        Route::get("/detail/{id}", [AdminController::class, 'show']);
    });
    // Admins End

    // Lawyers Start
    Route::group(["prefix" => "lawyer"], function () {
        Route::get("/list", [LawyerController::class, 'index']);
        Route::post("/create", [LawyerController::class, 'store']);
        Route::post("/update/{id}", [LawyerController::class, 'update']);
        Route::get("/destroy/{id}", [LawyerController::class, 'destroy']);
        Route::get("/detail/{id}", [LawyerController::class, 'show']);
    });
    // Lawyers End

    // Clients Start
    Route::group(["prefix" => "client"], function () {
        Route::get("/list", [ClientController::class, 'index']);
        Route::post("/create", [ClientController::class, 'store']);
        Route::post("/update/{id}", [ClientController::class, 'update']);
        Route::get("/destroy/{id}", [ClientController::class, 'destroy']);
        Route::get("/detail/{id}", [ClientController::class, 'show']);
    });
    // Clients End

    // carousel Started
    Route::group(["prefix" => "carousel"], function () {
        Route::get("/fetch", [CarouselController::class, 'index']);
        Route::post("/add-image", [CarouselController::class, 'add_carousel_image']);
        Route::post("/add-text", [CarouselController::class, 'add_carousel_text']);
        Route::post("/update-text/{id}", [CarouselController::class, 'update_carousel_text']);
        Route::get("/delete-image/{id}", [CarouselController::class, 'delete_carousel_image']);
        Route::post("/reorder-images", [CarouselController::class, 'update_image_order']);
    });
    // carousel End

    // FAQs Start
    Route::group(["prefix" => "faqs"], function () {
        Route::get("/list", [FAQsController::class, 'index']);
        Route::post("/reorder", [FAQsController::class, 'update_order']);
        Route::get("/details/{id}", [FAQsController::class, 'show']);
        Route::post("/create", [FAQsController::class, 'store']);
        Route::post("/update/{id}", [FAQsController::class, 'update']);
        Route::get("/delete/{id}", [FAQsController::class, 'destroy']);
    });
    // FAQs End

    // Tags Start
    Route::group(["prefix" => "tags"], function () {
        Route::get("/list", [TagsController::class, 'index']);
        Route::get("/details/{id}", [TagsController::class, 'show']);
        Route::post("/create", [TagsController::class, 'store']);
        Route::post("/update/{id}", [TagsController::class, 'update']);
        Route::get("/delete/{id}", [TagsController::class, 'destroy']);
    });
    // Tags End

    // Categories Start
    Route::group(["prefix" => "categories"], function () {
        Route::get("/list", [CategoriesController::class, 'index']);
        Route::get("/details/{id}", [CategoriesController::class, 'show']);
        Route::post("/create", [CategoriesController::class, 'store']);
        Route::post("/update/{id}", [CategoriesController::class, 'update']);
        Route::get("/delete/{id}", [CategoriesController::class, 'destroy']);
    });
    // Categories End

    // Blogs Start
    Route::group(["prefix" => "blogs"], function () {
        Route::get("/list", [BlogsController::class, 'index']);
        Route::get("/details/{slug}", [BlogsController::class, 'show']);
        Route::post("/create", [BlogsController::class, 'store']);
        Route::post("/update/{id}", [BlogsController::class, 'update']);
        Route::get("/delete/{id}", [BlogsController::class, 'destroy']);
    });
    // Blogs End

    // Contact Us APIs Start
    Route::group(["prefix" => "contact-us"], function () {
        Route::get('messages', [ContactUsController::class, 'messages']);
        Route::post('respond', [ContactUsController::class, 'respond']);
        Route::get('message/{id}/delete', [ContactUsController::class, 'destroy']);
    });
    // Contact Us APIs End

    // Newsletters APIs Start
    Route::group(["prefix" => "newsletters"], function () {
        Route::get('subscribers', [NewsletterController::class, 'index']);
    });
    // Newsletters APIs End
});
// * Super Admin APIs End

// * Admin APIs Start
Route::group(["prefix" => "admin", "middleware" => ["isAdmin", "auth:api", "isAccountActive"]], function () {

    // Admin Dashboard Start  
    Route::get('/dashboard', [SuperAdminDashboardController::class, 'index']);
    Route::get('/chart-data', [SuperAdminDashboardController::class, 'chart_data']);
    Route::post('/profile-pic', [SuperAdminDashboardController::class, 'profileimage']);
    Route::post('/personal-information', [SuperAdminDashboardController::class, 'personal_info']);
    Route::post('/address-detail', [SuperAdminDashboardController::class, 'address_info']);
    Route::post('/change-password', [SuperAdminDashboardController::class, 'update_password']);
    Route::post('/update-profile/{id}', [SuperAdminDashboardController::class, 'update']);
    Route::post('/update-country-status/{id}', [SuperAdminDashboardController::class, 'update_country_status']);
    Route::get('/all-countries', [SuperAdminDashboardController::class, 'countries']);
    Route::get("/user-stats/{id}", [SuperAdminDashboardController::class, 'user_complete_stats']);
    // Admin Dashboard End

    // Area Of Expertise Started
    Route::group(["prefix" => "area-expertise"], function () {
        Route::get("/list", [AreaExpertiseController::class, 'index']);
        Route::post("/create", [AreaExpertiseController::class, 'store']);
        Route::post("/update/{id}", [AreaExpertiseController::class, 'update']);
        Route::get("/destroy/{id}", [AreaExpertiseController::class, 'destroy']);
        Route::get("/detail/{id}", [AreaExpertiseController::class, 'show']);
    });
    // Area Of Expertise End

    // Jurisdictions Start
    Route::group(["prefix" => "jurisdiction"], function () {
        Route::get("/list", [JurisdictionController::class, 'index']);
        Route::post("/create", [JurisdictionController::class, 'store']);
        Route::post("/update/{id}", [JurisdictionController::class, 'update']);
        Route::get("/destroy/{id}", [JurisdictionController::class, 'destroy']);
        Route::get("/detail/{id}", [JurisdictionController::class, 'show']);
    });
    // Jurisdictions End

    // Lawyers Start
    Route::group(["prefix" => "lawyer"], function () {
        Route::get("/list", [LawyerController::class, 'index']);
        Route::post("/create", [LawyerController::class, 'store']);
        Route::post("/update/{id}", [LawyerController::class, 'update']);
        Route::get("/destroy/{id}", [LawyerController::class, 'destroy']);
        Route::get("/detail/{id}", [LawyerController::class, 'show']);
    });
    // Lawyers End

    // Clients Start
    Route::group(["prefix" => "client"], function () {
        Route::get("/list", [ClientController::class, 'index']);
        Route::post("/create", [ClientController::class, 'store']);
        Route::post("/update/{id}", [ClientController::class, 'update']);
        Route::get("/destroy/{id}", [ClientController::class, 'destroy']);
        Route::get("/detail/{id}", [ClientController::class, 'show']);
    });
    // Clients End

    // carousel Started
    Route::group(["prefix" => "carousel"], function () {
        Route::get("/fetch", [CarouselController::class, 'index']);
        Route::post("/add-image", [CarouselController::class, 'add_carousel_image']);
        Route::post("/add-text", [CarouselController::class, 'add_carousel_text']);
        Route::post("/update-text/{id}", [CarouselController::class, 'update_carousel_text']);
        Route::get("/delete-image/{id}", [CarouselController::class, 'delete_carousel_image']);
        Route::post("/reorder-images", [CarouselController::class, 'update_image_order']);
    });
    // carousel End

    // FAQs Start
    Route::group(["prefix" => "faqs"], function () {
        Route::get("/list", [FAQsController::class, 'index']);
        Route::post("/reorder", [FAQsController::class, 'update_order']);
        Route::get("/details/{id}", [FAQsController::class, 'show']);
        Route::post("/create", [FAQsController::class, 'store']);
        Route::post("/update/{id}", [FAQsController::class, 'update']);
        Route::get("/delete/{id}", [FAQsController::class, 'destroy']);
    });
    // FAQs End

    // Tags Start
    Route::group(["prefix" => "tags"], function () {
        Route::get("/list", [TagsController::class, 'index']);
        Route::get("/details/{id}", [TagsController::class, 'show']);
        Route::post("/create", [TagsController::class, 'store']);
        Route::post("/update/{id}", [TagsController::class, 'update']);
        Route::get("/delete/{id}", [TagsController::class, 'destroy']);
    });
    // Tags End

    // Categories Start
    Route::group(["prefix" => "categories"], function () {
        Route::get("/list", [CategoriesController::class, 'index']);
        Route::get("/details/{id}", [CategoriesController::class, 'show']);
        Route::post("/create", [CategoriesController::class, 'store']);
        Route::post("/update/{id}", [CategoriesController::class, 'update']);
        Route::get("/delete/{id}", [CategoriesController::class, 'destroy']);
    });
    // Categories End

    // Blogs Start
    Route::group(["prefix" => "blogs"], function () {
        Route::get("/list", [BlogsController::class, 'index']);
        Route::get("/details/{slug}", [BlogsController::class, 'show']);
        Route::post("/create", [BlogsController::class, 'store']);
        Route::post("/update/{id}", [BlogsController::class, 'update']);
        Route::get("/delete/{id}", [BlogsController::class, 'destroy']);
    });
    // Blogs End

    // Contact Us APIs Start
    Route::group(["prefix" => "contact-us"], function () {
        Route::get('messages', [ContactUsController::class, 'messages']);
        Route::post('respond', [ContactUsController::class, 'respond']);
        Route::get('message/{id}/delete', [ContactUsController::class, 'destroy']);
    });
    // Contact Us APIs End

    // Newsletters APIs Start
    Route::group(["prefix" => "newsletters"], function () {
        Route::get('subscribers', [NewsletterController::class, 'index']);
    });
    // Newsletters APIs End
});
// * Admin APIs End

// * Lawyer APIs Start
Route::group(["prefix" => "lawyer", "middleware" => ["isLawyer", "auth:api", "isAccountActive"]], function () {


    Route::get('/notifications', [NotificationsController::class, 'index']);
    Route::delete('/notification/{id}', [NotificationsController::class, 'destroy']);
    Route::put('/notification/{id}', [NotificationsController::class, 'mark_as_read']);
    Route::get('/notification/count', [NotificationsController::class, 'unread_notification_count']);

    // Lawyer Dashboard Start
    Route::post('/profile-pic', [LawyerDashboardController::class, 'profileimage']);
    Route::post('/personal-information', [LawyerDashboardController::class, 'personal_info']);
    Route::post('/address-detail', [LawyerDashboardController::class, 'address_info']);
    Route::post('/change-password', [LawyerDashboardController::class, 'update_password']);
    Route::put('/email-notifications/{status}', [AllAuthController::class, 'email_notifications']);
    // Lawyer Dashboard End

    // Meeting APIs Start
    Route::group(["prefix" => "meeting"], function () {
        Route::get('/check-meeting/{id}', [ClientMeetingController::class, 'check_meeting']);
        Route::get('/end-meeting/{id}', [ClientMeetingController::class, 'endMeeting']);
    });
    // Meeting APIs End

    // withdraw Request APIs Start
    Route::group(["prefix" => "withdraw"], function () {
        Route::get('/list', [WithdrawRequestController::class, 'withdraw_request_list']);
        Route::post('/request', [WithdrawRequestController::class, 'withdraw_request']);
        Route::post('/update-iban', [WithdrawRequestController::class, 'update_iban']);
    });
    // withdraw Request APIs End

    // Lawyer Cases Start
    Route::group(["prefix" => "cases"], function () {
        Route::get('/list/{status}', [CaseController::class, 'index']);
        Route::post('/update/{id}', [CaseController::class, 'update']);
        Route::get('/destroy-all', [CaseController::class, 'destroyAll']);
        Route::get('/destroy/{id}', [CaseController::class, 'destroy']);
    });
    // Lawyer Cases End

    // Lawyer Contracts Start
    Route::group(["prefix" => "contracts"], function () {
        Route::get('/client-list', [ContractController::class, 'getClients']);
        Route::post('/create', [ContractController::class, 'store']);
        Route::get('/list/{status}', [ContractController::class, 'list']);
        Route::get('/show/{id}', [ContractController::class, 'show']);
        Route::get('/complete-request/{id}', [ContractController::class, 'CompleteRequest']);
    });
    // Lawyer Contracts End

    // Milestone APIs Routes Start
    Route::group(["prefix" => "milestones"], function () {
        Route::get('/stages-with-steps/{id}', [MilestoneController::class, 'index']);
        Route::post('/create-milestone-stage', [MilestoneController::class, 'create_milestone_stage']);
        Route::get('/get-milestone-steps/{id}', [MilestoneController::class, 'get_milestone_steps']);
        Route::post('/create-milestone-step', [MilestoneController::class, 'create_milestone_step']);
        Route::post('/update-step-status/{id}', [MilestoneController::class, 'update_step_status']);
    });
    // Milestone APIs Routes End

    // Transactions Start
    Route::group(["prefix" => "transactions"], function () {
        Route::get('/list', [TransactionsController::class, 'index']);
        Route::get('/show/{id}', [TransactionsController::class, 'show']);
    });
    // Transactions End

    // Lawyer payment Start
    Route::group(["prefix" => "payment"], function () {
        Route::post('/create-payment', [PaymentController::class, 'createPaymentIntent']);
    });
    // Lawyer payment End

    // TimeSlot Start
    Route::group(["prefix" => "time-slot"], function () {
        Route::get("/list", [TimeSlotController::class, 'index']);
        Route::post("/create", [TimeSlotController::class, 'store']);
        Route::post("/update/{id}", [TimeSlotController::class, 'update']);
        Route::get("/destroy/{id}", [TimeSlotController::class, 'destroy']);
        Route::get("/generate", [TimeSlotController::class, 'generateTimeSlots']);
    });
    // TimeSlot End

    // Lawyer Availability Start
    Route::group(["prefix" => "lawyer-availability"], function () {
        Route::get("/list", [LawyersAvailabilityController::class, 'index']);
        Route::get("/show/{id}", [LawyersAvailabilityController::class, 'show']);
        Route::post("/create", [LawyersAvailabilityController::class, 'store']);
        Route::post("/update/{id}", [LawyersAvailabilityController::class, 'update']);
        Route::get("/destroy/{id}", [LawyersAvailabilityController::class, 'destroy']);
    });
    // Lawyer Availability End

    // Chat Start
    Route::group(["prefix" => "chat"], function () {
        Route::get("/list/{recevier_id}", [LawyersChatController::class, 'index']);
        Route::get("/people-list", [LawyersChatController::class, 'people_list']);
        Route::post("/create", [LawyersChatController::class, 'store']);
        Route::get("/attachment/{type}/{sender_id}", [LawyersChatController::class, 'show_attachment']);
        Route::post('/messages', [LawyersChatController::class, 'message']);
        Route::get("/mark-as-read/{sender_id}", [ChatController::class, 'mark_msg_as_read']);
        Route::post('/destory-all', [LawyersChatController::class, 'destroyAll']);
        Route::get('/unread-messages', [LawyersChatController::class, 'unread_messages']);
    });
    // Chat End

    // Appointments Start
    Route::group(["prefix" => "appointments"], function () {
        Route::get("/list", [AppointmentController::class, 'index']);
        Route::post("/update", [LawyersAppointmentController::class, 'update']);
    });
    // Appointments End
});
// * Lawyer APIs End


// * Client APIs Start
Route::group(["prefix" => "client", "middleware" => ["isClient", "auth:api", "isAccountActive"]], function () {

    // ? submit case 
    Route::post("/submit-case", [CaseController::class, 'submit_case']);
    Route::post("/case-request", [CaseController::class, 'case_request']);
    Route::get('/cases/{status}', [CaseController::class, 'index']);
    Route::get('/pending-cases', [CaseController::class, 'pending_cases']);
    Route::get('/case/{id}', [CaseController::class, 'find']);
    Route::get('/notifications', [NotificationsController::class, 'index']);
    Route::delete('/notification/{id}', [NotificationsController::class, 'destroy']);
    Route::put('/notification/{id}', [NotificationsController::class, 'mark_as_read']);
    Route::get('/notification/count', [NotificationsController::class, 'unread_notification_count']);
    Route::get("/lawyer/{id}/availability", [LawyersAvailabilityController::class, 'index']);

    // Client Dashboard Start  
    Route::get('/dashboard', [ClientDashboardController::class, 'index']);
    Route::get('/cases/{status}', [CaseController::class, 'index']);
    Route::post('/profile-pic', [ClientDashboardController::class, 'profileimage']);
    Route::post('/personal-information', [ClientDashboardController::class, 'personal_info']);
    Route::post('/address-detail', [ClientDashboardController::class, 'address_info']);
    Route::post('/change-password', [ClientDashboardController::class, 'update_password']);
    Route::put('/email-notifications/{status}', [AllAuthController::class, 'email_notifications']);
    // Client Dashboard End


    Route::group(["prefix" => "meeting"], function () {
        Route::get('/check-meeting/{id}', [ClientMeetingController::class, 'check_meeting']);
        Route::get('/end-meeting/{id}', [ClientMeetingController::class, 'endMeeting']);
    });


    // Client payment Start
    Route::group(["prefix" => "payment"], function () {
        Route::post('/create-payment', [PaymentController::class, 'createPaymentIntent']);
    });
    // Client payment End

    // Client Contracts Start
    Route::group(["prefix" => "contracts"], function () {
        Route::get('/show/{id}', [ClientContractController::class, 'show']);
        Route::get('/list/{status}', [ContractController::class, 'list']);
        Route::post('/accept-contract', [ClientContractController::class, 'acceptContrant']);
        Route::get('/complete-requests-list', [ClientContractController::class, 'completeRequestsList']);
        Route::post('/complete-contract', [ClientContractController::class, 'acceptCompleteRequest']);
    });
    // Client Contracts End

    // Transactions Start
    Route::group(["prefix" => "transactions"], function () {
        Route::get('/list', [TransactionsController::class, 'index']);
        Route::get('/show/{id}', [TransactionsController::class, 'show']);
    });
    // Transactions End

    // Milestone APIs Routes Start
    Route::group(["prefix" => "milestones"], function () {
        Route::get('/stages-with-steps/{id}', [MilestoneController::class, 'index']);
        Route::get('/get-milestone-steps/{id}', [MilestoneController::class, 'get_milestone_steps']);
    });
    // Milestone APIs Routes End

    // Appointments Start
    Route::group(["prefix" => "appointments"], function () {
        Route::get("/list", [AppointmentController::class, 'index']);
        Route::post("/fetch-time-slots", [AppointmentController::class, 'fetch_time_slots']);
        Route::post("/book", [AppointmentController::class, 'store']);
    });
    // Appointments End


    // Chat Start
    Route::group(["prefix" => "chat"], function () {
        Route::get("/list/{recevier_id}", [LawyersChatController::class, 'index']);
        Route::get("/people-list", [ChatController::class, 'people_list']);
        Route::get("/case-availability/{id}", [ChatController::class, 'case_availability']);
        Route::post("/case-request", [ChatController::class, 'case_request']); // ! this is useless now because of the flow change
        Route::post("/create", [ChatController::class, 'store']);
        Route::get("/attachment/{type}/{sender_id}", [LawyersChatController::class, 'show_attachment']);
        Route::post('/messages', [ChatController::class, 'message']);
        Route::get("/mark-as-read/{sender_id}", [ChatController::class, 'mark_msg_as_read']);
        Route::post('/destory-all', [ChatController::class, 'destroyAll']);
        Route::get('/case-destory-all', [ChatController::class, 'caseDestroyAll']);
        Route::get('/profile-details/{lawyer_id}', [ChatController::class, 'profile_details']);
        Route::get('/unread-messages', [LawyersChatController::class, 'unread_messages']);
    });
    // Chat End
});
// * Client APIs End

// * Webiste APIs Start
Route::group(["prefix" => "website"], function () {
    Route::get('countries', [AllController::class, 'countries']);
    Route::get('jurisdiction', [AllController::class, 'jurisdiction']);
    Route::get('area-expertise', [AllController::class, 'area_expertise']);
    Route::post('state', [AllController::class, 'state']);
    Route::get('lawyer/{id}', [AllController::class, 'lawyer']);
    Route::post('appointment', [AllController::class, 'appointment']);
    Route::get('featured-lawyers', [AllController::class, 'featured_lawyers']);
    Route::get('find-lawyer', [AllController::class, 'find_lawyer']);
    Route::get('website-details', [AllController::class, 'website_details']);
    Route::get('faqs', [FAQsController::class, 'index']);
    Route::get('blog-categories', [CategoriesController::class, 'index']);
    Route::get('tags', [TagsController::class, 'index']);
    Route::get("/carousel", [CarouselController::class, 'index']);
});
// * Website APIs End

// * Contact Us APIs Start
Route::group(["prefix" => "contact"], function () {
    Route::post('send-email', [ContactUsController::class, 'index']);
});
// * Contact Us APIs End

// * Blogs APIs Start
Route::group(["prefix" => "blogs"], function () {
    Route::get('list', [BlogsController::class, 'index']);
});

Route::group(["prefix" => "/blog"], function () {
    Route::get('/{id}/comments', [BlogsController::class, 'blog_comments']);
    Route::get('/{slug}', [BlogsController::class, 'show']);
});

Route::group(["prefix" => "/", "middleware" => ["auth"]], function () {
    Route::post('blog/{id}/like', [BlogsController::class, 'like_blog']);
    Route::post('blog/{id}/comment', [BlogsController::class, 'comment_on_blog']);
    Route::post('comment/{id}/reply', [BlogsController::class, 'reply_on_comment']);
    Route::post('comment/{id}/edit', [BlogsController::class, 'edit_comment']);
    Route::get('comment/{id}/delete', [BlogsController::class, 'delete_comment']);
    Route::post('reply/{id}/edit', [BlogsController::class, 'edit_reply']);
    Route::get('reply/{id}/delete', [BlogsController::class, 'delete_reply']);
});
// * Blogs APIs End

// * Newsletters APIs Start
Route::group(["prefix" => "newsletters"], function () {
    Route::post('subscribe', [NewsletterController::class, 'subscribe']);
    Route::get('unsubscribe/{email}', [NewsletterController::class, 'unsubscribe']);
});
// * Newsletters APIs End



// * API for Development Purpose only
Route::get('get-user', [AllController::class, 'get_user']);
Route::post('add-balance/{id}', [AllController::class, 'add_balance']);
Route::post('create-transaction/{id}', [AllController::class, 'create_transaction']);
Route::post('upload-file', [HomeController::class, 'uploadFileOnS3Bucket']);
Route::get('fetch-files', [HomeController::class, 'fetchFiles']);
