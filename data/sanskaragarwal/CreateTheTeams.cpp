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

ll dp[100005], n, x;

ll solve(ll i, ll arr[])
{
	if (i > n)
		return -1;
	if (i == n)
		return 0;
	if (dp[i] != -1)
		return dp[i];
	ll req = x / arr[i];
	if (req * arr[i] != x)
		req++;
	ll a = 1 + solve(i + req, arr);
	ll b = solve(i + 1, arr);
	return dp[i] = max(a, b);
}

void solve()
{
	cin >> n >> x;
	ll arr[n];
	memset(dp, -1, sizeof(dp));
	for (ll i = 0; i < n; ++i)
		cin >> arr[i];
	sort(arr, arr + n);
	cout << solve(0, arr) << endl;
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