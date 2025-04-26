import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import '../models/user.dart';

class AuthService extends ChangeNotifier {
  bool _isAuthenticated = false;
  User? _currentUser;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  bool get isAuthenticated => _isAuthenticated;
  User? get currentUser => _currentUser;

  // Check if user is already logged in
  Future<void> checkAuth() async {
    final userJson = await _storage.read(key: 'user');
    if (userJson != null) {
      _currentUser = User.fromJson(json.decode(userJson));
      _isAuthenticated = true;
      notifyListeners();
    }
  }

  // Login method
  Future<bool> login(String username, String password) async {
    try {
      // In a real app, this would be an API call to your backend
      // For this demo, we'll simulate a successful login with a mock user
      if (username.isNotEmpty && password.isNotEmpty) {
        // Simulate server response
        final user = User(
          id: 1,
          name: 'Alexander Smith',
          username: username,
          email: 'alex.smith@school.edu',
          role: 'teacher',
        );
        
        // Store user info in secure storage
        await _storage.write(key: 'user', value: json.encode(user.toJson()));
        
        _currentUser = user;
        _isAuthenticated = true;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Login error: $e');
      return false;
    }
  }

  // Register method
  Future<bool> register(String name, String email, String username, String password) async {
    try {
      // In a real app, this would be an API call to your backend
      // For this demo, we'll simulate a successful registration
      if (name.isNotEmpty && email.isNotEmpty && username.isNotEmpty && password.isNotEmpty) {
        final user = User(
          id: 1,
          name: name,
          username: username,
          email: email,
          role: 'teacher',
        );
        
        await _storage.write(key: 'user', value: json.encode(user.toJson()));
        
        _currentUser = user;
        _isAuthenticated = true;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Registration error: $e');
      return false;
    }
  }

  // Logout method
  Future<void> logout() async {
    await _storage.delete(key: 'user');
    _currentUser = null;
    _isAuthenticated = false;
    notifyListeners();
  }
}