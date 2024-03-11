import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> routes = [
      {'name': 'Button', 'route': '/buttons'},
      {'name': 'Card', 'route': '/cards'},
      {'name': 'Typography', 'route': '/typography'},
      {'name': 'Input', 'route': '/input'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Components'),
      ),
      body: ListView.builder(
        itemCount: routes.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(routes[index]['name']!),
            onTap: () {
              Navigator.pushNamed(context, routes[index]['route']!);
            },
          );
        },
      ),
    );
  }
}