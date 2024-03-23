import 'package:flutter/material.dart';
import 'package:frontend/route/create_account/more_options.dart';
import 'package:frontend/route/create_account/verfy_your_email_address.dart';
import 'package:frontend/route/landing_page.dart';
import 'package:frontend/utils/route.dart';

import 'route/create_account/create_your_account.dart';
import 'route/create_account/create_your_account_email.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: router,
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true),
      title: 'Culero',
    );
  }
}
