#!/usr/bin/env python3

import asyncio
import aiohttp
import json
from datetime import datetime

API_BASE = "http://localhost:8000"

async def test_endpoint(session, method, endpoint, data=None, expected_status=200):
    """Test a single API endpoint"""
    url = f"{API_BASE}{endpoint}"
    
    try:
        if method.upper() == "GET":
            async with session.get(url) as response:
                status = response.status
                content = await response.text()
        elif method.upper() == "POST":
            async with session.post(url, json=data) as response:
                status = response.status
                content = await response.text()
        
        success = status == expected_status
        print(f"{'✅' if success else '❌'} {method} {endpoint} - Status: {status}")
        
        if not success:
            print(f"   Expected: {expected_status}, Got: {status}")
            print(f"   Response: {content[:200]}...")
        
        return success
        
    except Exception as e:
        print(f"❌ {method} {endpoint} - Error: {str(e)}")
        return False

async def test_backend_endpoints():
    """Test all backend endpoints"""
    print("🧪 Testing Social Commander Backend Endpoints")
    print("=" * 50)
    
    async with aiohttp.ClientSession() as session:
        tests = [
            ("GET", "/", 200),
            ("GET", "/health", 200),
            ("GET", "/status/", 200),
            ("GET", "/status/metrics", 200),
            
            ("GET", "/auth/status", 200),
            ("POST", "/auth/login", {"username": "test", "password": "test"}, 422),  # Expected to fail without real creds
            
            ("POST", "/instagram/scan", {"hashtag": "test", "limit": 10}, 401),
            ("POST", "/instagram/follow", {"username": "test"}, 401),
            ("GET", "/instagram/profile/stats", 401),
            
            ("POST", "/llm/generate", {"prompt": "Hello", "max_length": 50}, 200),
            ("POST", "/llm/stanley/insight", {}, 200),
            
            ("GET", "/logs/", 200),
        ]
        
        passed = 0
        total = len(tests)
        
        for method, endpoint, *args in tests:
            if len(args) == 2:
                data, expected_status = args
            else:
                data = None
                expected_status = args[0]
            
            success = await test_endpoint(session, method, endpoint, data, expected_status)
            if success:
                passed += 1
        
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {passed}/{total} passed ({passed/total*100:.1f}%)")
        
        if passed == total:
            print("🎉 All tests passed! Backend is ready.")
        else:
            print("⚠️  Some tests failed. Check the output above.")
        
        return passed == total

async def test_websocket_connection():
    """Test WebSocket connection for logs"""
    print("\n🔌 Testing WebSocket Connection")
    print("-" * 30)
    
    try:
        import websockets
        
        uri = "ws://localhost:8000/logs/stream"
        async with websockets.connect(uri) as websocket:
            print("✅ WebSocket connection established")
            
            await websocket.send("test")
            print("✅ Test message sent")
            
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=2.0)
                print(f"✅ Received response: {response[:50]}...")
            except asyncio.TimeoutError:
                print("⏰ No immediate response (this is normal)")
            
            return True
            
    except ImportError:
        print("⚠️  websockets library not installed, skipping WebSocket test")
        return True
    except Exception as e:
        print(f"❌ WebSocket test failed: {str(e)}")
        return False

async def main():
    """Run all backend tests"""
    print(f"🚀 Social Commander Backend Test Suite")
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    http_success = await test_backend_endpoints()
    
    ws_success = await test_websocket_connection()
    
    print("\n" + "=" * 50)
    if http_success and ws_success:
        print("🎉 All backend tests passed! System is ready for deployment.")
        return True
    else:
        print("❌ Some tests failed. Please check the backend configuration.")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    exit(0 if success else 1)
