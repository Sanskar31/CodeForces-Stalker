/*
Author: Sanskar Agarwal
Nick: sanskaragarwal
Birla Institute Of Technology, Mesra
*/
#include <bits/stdc++.h>
using namespace std;
#define ll long long int
#define endl "\n"
#define fast ios::sync_with_stdio(0);cin.tie(0);cout.tie(0);
#define F(i,a,b) for(ll i = (ll)(a); i <= (ll)(b); i++)
#define RF(i,a,b) for(ll i = (ll)(a); i >= (ll)(b); i--)
#define INF 100009
#define mod 1000000007
#define pb(x) push_back(x)
#define mp(x,y) make_pair(x,y)
#define ff first
#define ss second
#define test while(t--)solve();

void solve()
{
	string s;
	cin >> s;
	int n = s.length();
	string ans = "";
	unordered_map<char, char> mp;
	mp['S'] = 'R';
	mp['R'] = 'P';
	mp['P'] = 'S';
	unordered_map<char, int> freq;
	for (int i = 0; i < n; ++i)
		freq[mp[s[i]]]++;
	int maxx = 0;
	char a;
	for (auto i : freq)
	{
		if (i.second > maxx)
		{
			a = i.first;
			maxx = i.second;
		}
	}
	for (int i = 0; i < n; ++i)
		cout << a;
	cout << endl;
}

int main()
{
#ifndef ONLINE_JUDGE
	freopen("../input.txt", "r", stdin);
	freopen("../output.txt", "w", stdout);
#endif
	fast
	int t;
	// t = 1;
	cin >> t;
	test;
#ifndef ONLINE_JUDGE
	cout << "\nTime Elapsed : " << 1.0 * clock() / CLOCKS_PER_SEC << " s\n";
#endif
	return 0;
}