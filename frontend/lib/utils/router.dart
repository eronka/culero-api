

import 'package:frontend/route/app/app_page.dart';
import 'package:frontend/route/component_page.dart';
import 'package:frontend/route/landing_page.dart';
import 'package:go_router/go_router.dart';


final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      name: 'landing_page', // Optional, add name to your routes. Allows you navigate by name instead of path
      path: '/',
      builder: (context, state) => const ComponentPage(),
    ),

    GoRoute(
      name: 'app',
      path: '/app',
      builder: (context, state) => const AppPage(),
    ),
  ],
);