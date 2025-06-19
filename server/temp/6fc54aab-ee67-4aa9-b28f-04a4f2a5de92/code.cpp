#include<iostream>
using namespace std;
int main(){string s;cin>>s;int c=0;for(char ch:s)if(string("aeiou").find(ch)!=string::npos)c++;cout<<c;return 0;}