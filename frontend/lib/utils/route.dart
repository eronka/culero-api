import 'package:frontend/route/app/app_page.dart';
import 'package:frontend/route/component_page.dart';
import 'package:frontend/route/create_account/create_your_account.dart';
import 'package:frontend/route/create_account/create_your_account_email.dart';
import 'package:frontend/route/create_account/email_is_verfied.dart';
import 'package:frontend/route/create_account/verfy_your_email_address.dart';
import 'package:frontend/route/landing_page.dart';
import 'package:go_router/go_router.dart';
import 'package:frontend/route/create_account/more_options.dart';
import 'package:frontend/route/landing_page.dart';


final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      name: 'landing_page',
      path: '/',
      builder: (context, state) => const LandingPage(),
    ),
    GoRoute(
      name: 'sign_up',
      path: '/signup',
      builder: (context, state) => const CreateYourAccount(),
    ),
    GoRoute(
      name: 'more_options',
      path: '/moreoptions',
      builder: (context, state) => const MoreOptions(),
    ),
    GoRoute(
      name: 'signup_email',
      path: '/signupemail',
      builder: (context, state) => const CreateYourAccountEmail(),
    ),
     GoRoute(
      name: 'verfy_email',
      path: '/verfyemail',
      builder: (context, state) => const VerfyYourEmail(),
    ),
     GoRoute(
      name: 'email_verified',
      path: '/emailverified',
      builder: (context, state) => const EmailIsVerfied(),
    ),
    GoRoute(
      name: 'app',
      path: '/app',
      builder: (context, state) => const AppPage(),
    ),
  ],
);
