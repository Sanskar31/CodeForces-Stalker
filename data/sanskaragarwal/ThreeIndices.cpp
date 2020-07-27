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
	int n;
	cin >> n;
	int arr[n];
	for (int i = 0; i < n; ++i)
		cin >> arr[i];
	int i = -1, j = -1, k = -1, l = 0;
	for (; l < n - 1; ++l)
	{
		if (arr[l] < arr[l + 1])
		{
			i = l, j = l + 1;
			break;
		}
	}
	if (i == -1)
	{
		cout << "NO" << endl;
		return;
	}
	l++;
	while (l < n)
	{
		if (arr[l] > arr[j])
			j = l;
		else if (arr[l] < arr[j])
		{
			k = l;
			break;
		}
		l++;
	}
	if (k != -1)
		cout << "YES" << endl << i + 1 << " " << j + 1 << " " << k + 1 << endl;
	else
		cout << "NO" << endl;
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