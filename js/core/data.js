const CSV_DATA = `
Pl/str;UNE;spr;Bdl kmtal till;spm;sid;Objekttyp;Objekt;obinr
Rsi;E2;2;0+104;0;y;Signalpunktstavla ERTMS;MT 154;1519
Rsi;E2;2;0+321;0;h;Signalpunktstavla ERTMS;MT 144;1520
Rsi;E2;2;0+940;0;y;Signalpunktstavla ERTMS;MT 109;1521
Rsi;E2;2;1+136;0;y;Signalpunktstavla ERTMS;MT 119;1522
Rsi;E2;2;1+416;0;h;Signalpunktstavla ERTMS;UTFT L203;1743
Rsi;E2;2;1+535;0;h;Signalpunktstavla ERTMS;INFT 104;1523
Gv;E;;1317+ 492;0;y;Signalpunktstavla ERTMS;LT L420;1694
Stk;E;;1317+ 492;0;y;Signalpunktstavla ERTMS;LT L221;1695
Gv;E;;1320+ 878;0;h;Signalpunktstavla ERTMS;LT L430;1696
Stk;E;;1320+ 878;0;h;Signalpunktstavla ERTMS;LT L211;1697
Stk;E;2;1322+ 660;0;y;Signalpunktstavla ERTMS;INFT 102;1228
Stk;E;2;1322+ 816;0;y;Signalpunktstavla ERTMS;UTFT L201;1698
Stk;;1;1322+ 970;0;h;Signalpunktstavla ERTMS;MT 149;1230
Stk;E;2;1322+ 970;0;y;Signalpunktstavla ERTMS;MT 151;1229
Stk;;1;1323+ 72;0;h;Signalpunktstavla ERTMS;MT 139;1232
Stk;E;2;1323+ 72;0;y;Signalpunktstavla ERTMS;MT 141;1231
Stk;E;2;1323+ 404;0;y;Signalpunktstavla ERTMS;MT 142;1234
Stk;;1;1323+ 404;0;h;Signalpunktstavla ERTMS;MT 144;1233
Stk;E;2;1323+ 504;0;y;Signalpunktstavla ERTMS;MT 152;1235
Stk;;1;1323+ 504;0;h;Signalpunktstavla ERTMS;MT 154;1236
Stk;E;2;1323+ 663;0;y;Signalpunktstavla ERTMS;UTFT L202;1237
Stk;E;2;1323+ 817;0;h;Signalpunktstavla ERTMS;INFT 101;1238
Stk-Lin;E;;1325+128;0;y;Signalpunktstavla ERTMS;LT L212;1239
Stk-Lin;E;;1325+128;0;y;Signalpunktstavla ERTMS;LT L241;1240
Stk-Lin;E;;1328+ 2;0;h;Signalpunktstavla ERTMS;LT L222;1241
Stk-Lin;E;;1328+ 2;0;h;Signalpunktstavla ERTMS;LT L231;1242
Stk-Lin;E;;1331+162;0;y;Signalpunktstavla ERTMS;LT L232;1243
Stk-Lin;E;;1331+162;0;y;Signalpunktstavla ERTMS;LT L221;1244
Stk-Lin;E;;1334+192;0;h;Signalpunktstavla ERTMS;LT L242;1245
Stk-Lin;E;;1334+192;0;h;Signalpunktstavla ERTMS;LT L211;1246
Lin;E;3;1335+ 561;0;h;Signalpunktstavla ERTMS;INFT 102;1227
Lin;E;3;1335+ 684;0;h;Signalpunktstavla ERTMS;UTFT L201;1247
Lin;E;3;1335+ 870;0;h;Signalpunktstavla ERTMS;MT 151;1248
Lin;;2;1335+ 929;0;h;Signalpunktstavla ERTMS;MT 153;1249
Lin;;1;1335+ 929;0;y;Signalpunktstavla ERTMS;MT 155;1250
Lin;E;3;1335+ 970;0;h;Signalpunktstavla ERTMS;MT 141;1251
Lin;;2;1336+ 33;0;h;Signalpunktstavla ERTMS;MT 143;1252
Lin;;1;1336+ 33;0;h;Signalpunktstavla ERTMS;MT 145;1253
Lin;;2;1336+ 354;0;y;Signalpunktstavla ERTMS;MT 140;1254
Lin;;1;1336+ 354;0;y;Signalpunktstavla ERTMS;MT 138;1255
Lin;;2;1336+ 455;0;y;Signalpunktstavla ERTMS;MT 150;1257
Lin;;1;1336+ 455;0;y;Signalpunktstavla ERTMS;MT 148;1258
Lin;E;3;1336+ 604;0;h;Signalpunktstavla ERTMS;MT 162;1748
Lin;;2;1336+ 618;0;y;Signalpunktstavla ERTMS;MT 160;1749
Lin;E;3;1336+ 704;0;h;Signalpunktstavla ERTMS;MT 172;1750
Lin;;2;1336+ 718;0;y;Signalpunktstavla ERTMS;MT 170;1751
Lin;E;3;1336+ 918;0;h;Signalpunktstavla ERTMS;UTFT L202;1260
Lin;E;3;1337+ 31;0;h;Signalpunktstavla ERTMS;INFT 101;1261
Lin-Håk;E;;1337+ 816;0;y;Signalpunktstavla ERTMS;LT L212;1262
Lin-Håk;E;;1337+ 816;0;y;Signalpunktstavla ERTMS;LT L231;1263
Lin-Håk;E;;1340+ 758;0;h;Signalpunktstavla ERTMS;LT L222;1264
Lin-Håk;E;;1340+ 758;0;h;Signalpunktstavla ERTMS;LT L221;1265
Lin-Håk;E;;1344+ 250;0;h;Signalpunktstavla ERTMS;LT L232;1266
Lin-Håk;E;;1344+ 250;0;h;Signalpunktstavla ERTMS;LT L211;1267
Håk;E;1;1345+ 256;0;y;Signalpunktstavla ERTMS;INFT 102;1191
Håk;E;1;1345+ 359;0;h;Signalpunktstavla ERTMS;UTFT L201;1192
Håk;;2;1345+ 565;0;h;Signalpunktstavla ERTMS;MT 149;1194
Håk;E;1;1345+ 565;0;y;Signalpunktstavla ERTMS;MT 151;1193
Håk;E;1;1345+ 668;0;y;Signalpunktstavla ERTMS;MT 141;1195
Håk;;2;1345+ 725;0;h;Signalpunktstavla ERTMS;MT 139;1196
Håk;E;1;1345+ 990;0;y;Signalpunktstavla ERTMS;MT 142;1197
Håk;;2;1345+ 991;0;h;Signalpunktstavla ERTMS;MT 144;1198
Håk;;2;1346+ 92;0;h;Signalpunktstavla ERTMS;MT 154;1199
Håk;E;1;1346+ 92;0;y;Signalpunktstavla ERTMS;MT 152;1200
Håk;E;1;1346+ 293;0;y;Signalpunktstavla ERTMS;UTFT L202;1201
Håk;E;1;1346+ 394;0;y;Signalpunktstavla ERTMS;INFT 101;1189
Håk-Har;E;;1348+183;0;h;Signalpunktstavla ERTMS;LT L212;1202
Håk-Har;E;;1348+183;0;h;Signalpunktstavla ERTMS;LT L231;1203
Håk-Har;E;;1351+647;0;h;Signalpunktstavla ERTMS;LT L222;1204
Håk-Har;E;;1351+647;0;h;Signalpunktstavla ERTMS;LT L221;1205
Håk-Har;E;;1355+147;0;h;Signalpunktstavla ERTMS;LT L232;1206
Håk-Har;E;;1355+147;0;h;Signalpunktstavla ERTMS;LT L211;1207
Har;E;3;1356+ 797;0;y;Signalpunktstavla ERTMS;INFT 102;1190
Har;E;3;1356+ 964;0;y;Signalpunktstavla ERTMS;UTFT L201;1208
Har;;2;1357+ 227;0;y;Signalpunktstavla ERTMS;MT 153;1210
Har;E;3;1357+ 227;0;h;Signalpunktstavla ERTMS;MT 151;1209
Har;;2;1357+ 339;0;y;Signalpunktstavla ERTMS;MT 143;1211
Har;E;3;1357+ 339;0;h;Signalpunktstavla ERTMS;MT 141;1212
Har;;1;1357+ 611;0;y;Signalpunktstavla ERTMS;MT 125;1214
Har;;2;1357+ 619;0;h;Signalpunktstavla ERTMS;MT 123;1213
Har;;1;1357+ 674;0;y;Signalpunktstavla ERTMS;MT 118;1215
Har;;2;1357+ 674;0;y;Signalpunktstavla ERTMS;MT 120;1216
Har;;2;1357+ 901;0;y;Signalpunktstavla ERTMS;MT 140;1217
Har;E;3;1357+ 902;0;h;Signalpunktstavla ERTMS;MT 142;1218
Har;E;3;1358+ 3;0;h;Signalpunktstavla ERTMS;MT 152;1219
Har;;2;1358+ 3;0;y;Signalpunktstavla ERTMS;MT 150;1220
Har;E;3;1358+ 229;0;h;Signalpunktstavla ERTMS;UTFT L202;1113
Har;E;3;1358+ 447;0;h;Signalpunktstavla ERTMS;INFT 101;1221
Har-Fjå;E;;1359+ 704;0;y;Signalpunktstavla ERTMS;LT L212;1114
Har-Fjå;E;;1359+ 704;0;h;Signalpunktstavla ERTMS;LT L241;1115
Har-Fjå;E;;1362+ 918;0;y;Signalpunktstavla ERTMS;LT L222;1116
Har-Fjå;E;;1362+ 918;0;y;Signalpunktstavla ERTMS;LT L231;1117
Har-Fjå;E;;1365+1002;0;h;Signalpunktstavla ERTMS;LT L232;1118
Har-Fjå;E;;1365+1002;0;h;Signalpunktstavla ERTMS;LT L221;1119
Har-Fjå;E;;1369+ 0;0;h;Signalpunktstavla ERTMS;LT L242;1120
Har-Fjå;E;;1369+ 0;0;h;Signalpunktstavla ERTMS;LT L211;1121
Fjå;E;2;1370+ 8;0;;Signalpunktstavla ERTMS;INFT 102;1111
Fjå;E;2;1370+184;0;h;Signalpunktstavla ERTMS;UTFT L201;1122
Fjå;;1;1370+ 484;0;h;Signalpunktstavla ERTMS;MT 149;1124
Fjå;E;2;1370+ 485;0;y;Signalpunktstavla ERTMS;MT 151;1123
Fjå;;1;1370+ 598;0;h;Signalpunktstavla ERTMS;MT 139;1125
Fjå;E;2;1370+ 598;0;y;Signalpunktstavla ERTMS;MT 141;1126
Fjå;E;2;1370+ 918;0;y;Signalpunktstavla ERTMS;MT 142;1127
Fjå;;1;1370+ 918;0;h;Signalpunktstavla ERTMS;MT 144;1128
Fjå;E;2;1371+ 18;0;y;Signalpunktstavla ERTMS;MT 152;1130
Fjå;;1;1371+ 19;0;h;Signalpunktstavla ERTMS;MT 154;1129
Fjå;E;2;1371+280;0;y;Signalpunktstavla ERTMS;UTFT L202;1131
Fjå;E;2;1371+486;0;y;Signalpunktstavla ERTMS;INFT 101;1132
Fjå-Lab;E;;1372+ 853;0;y;Signalpunktstavla ERTMS;LT L212;1133
Fjå-Lab;E;;1372+ 853;0;y;Signalpunktstavla ERTMS;LT L231;1134
Fjå-Lab;E;;1375+ 610;0;h;Signalpunktstavla ERTMS;LT L222;1135
Fjå-Lab;E;;1375+ 610;0;h;Signalpunktstavla ERTMS;LT L221;1136
Fjå-Lab;E;;1378+ 368;0;h;Signalpunktstavla ERTMS;LT L232;1137
Fjå-Lab;E;;1378+ 368;0;h;Signalpunktstavla ERTMS;LT L211;1138
Lab;E;3;1379+ 793;0;y;Signalpunktstavla ERTMS;INFT 102;1139
Lab;E;3;1379+ 933;0;y;Signalpunktstavla ERTMS;UTFT L201;1140
Lab;E;3;1380+ 243;0;y;Signalpunktstavla ERTMS;MT 151;1141
Lab;;2;1380+ 305;0;h;Signalpunktstavla ERTMS;MT 149;1142
Lab;;1;1380+ 305;0;h;Signalpunktstavla ERTMS;MT 147;1143
Lab;E;3;1380+ 343;0;y;Signalpunktstavla ERTMS;MT 141;1144
Lab;;2;1380+ 405;0;h;Signalpunktstavla ERTMS;MT 139;1145
Lab;;1;1380+ 405;0;h;Signalpunktstavla ERTMS;MT 137;1146
Lab;;1;1380+ 675;0;y;Signalpunktstavla ERTMS;MT 136;1147
Lab;;0;1380+ 675;0;h;Signalpunktstavla ERTMS;MT 138;1148
Lab;;1;1381+ 80;0;h;Signalpunktstavla ERTMS;MT 146;1150
Lab;;2;1381+ 80;0;y;Signalpunktstavla ERTMS;MT 144;1149
Lab;;1;1381+180;0;h;Signalpunktstavla ERTMS;MT 156;1151
Lab;;2;1381+180;0;y;Signalpunktstavla ERTMS;MT 154;1152
Lab;E;3;1381+185;0;y;Signalpunktstavla ERTMS;MT 142;1153
Lab;E;3;1381+ 291;0;y;Signalpunktstavla ERTMS;MT 152;1154
Lab;E;3;1381+478;0;h;Signalpunktstavla ERTMS;UTFT L202;1155
Lab;E;3;1381+726;0;h;Signalpunktstavla ERTMS;INFT 101;1156
Lab-Gy;E;;1382+ 607;0;y;Signalpunktstavla ERTMS;LT L212;1157
Lab-Gy;E;;1382+ 607;0;y;Signalpunktstavla ERTMS;LT L231;1158
Lab-Gy;E;;1385+ 841;0;y;Signalpunktstavla ERTMS;LT L222;1159
Lab-Gy;E;;1385+ 841;0;y;Signalpunktstavla ERTMS;LT L221;1160
Lab-Gy;E;;1389+ 14;0;y;Signalpunktstavla ERTMS;LT L232;1161
Lab-Gy;E;;1389+ 14;0;y;Signalpunktstavla ERTMS;LT L211;1162
Gy;E;1;1390+ 682;0;y;Signalpunktstavla ERTMS;INFT 102;1163
Gy;E;1;1390+ 853;0;y;Signalpunktstavla ERTMS;UTFT L201;1164
Gy;E;1;1391+152;0;h;Signalpunktstavla ERTMS;MT 151;1165
Gy;;2;1391+152;0;y;Signalpunktstavla ERTMS;MT 153;1166
Gy;E;1;1391+254;0;h;Signalpunktstavla ERTMS;MT 141;1168
Gy;;2;1391+254;0;y;Signalpunktstavla ERTMS;MT 143;1167
Gy;;2;1391+535;0;y;Signalpunktstavla ERTMS;MT 140;1169
Gy;E;1;1391+ 588;0;h;Signalpunktstavla ERTMS;MT 142;1170
Gy;E;1;1391+689;0;h;Signalpunktstavla ERTMS;MT 152;1172
Gy;;2;1391+689;0;y;Signalpunktstavla ERTMS;MT 150;1171
Gy;E;1;1392+ 17;0;h;Signalpunktstavla ERTMS;UTFT L202;1173
Gy;E;1;1392+163;0;h;Signalpunktstavla ERTMS;INFT 101;1174
Gy-Kx;E;;1393+ 655;0;h;Signalpunktstavla ERTMS;LT L212;1175
Gy-Kx;E;;1393+ 655;0;h;Signalpunktstavla ERTMS;LT L221;1176
Gy-Kx;E;;1396+ 794;0;h;Signalpunktstavla ERTMS;LT L222;1177
Gy-Kx;E;;1396+ 794;0;h;Signalpunktstavla ERTMS;LT L211;1178
Kx;E;2;1398+ 371;0;;Signalpunktstavla ERTMS;INFT 102;1112
Kx;E;2;1398+ 568;0;h;Signalpunktstavla ERTMS;UTFT L201;1179
Kx;;1;1398+ 862;0;y;Signalpunktstavla ERTMS;MT 153;1181
Kx;E;2;1398+ 862;0;h;Signalpunktstavla ERTMS;MT 151;1180
Kx;E;2;1398+ 962;0;h;Signalpunktstavla ERTMS;MT 141;1182
Kx;;1;1398+ 986;0;h;Signalpunktstavla ERTMS;MT 143;1183
Kx;;1;1399+ 299;0;y;Signalpunktstavla ERTMS;MT 140;1184
Kx;E;2;1399+ 299;0;h;Signalpunktstavla ERTMS;MT 142;1185
Kx;;1;1399+ 399;0;y;Signalpunktstavla ERTMS;MT 150;1187
Kx;E;2;1399+ 399;0;h;Signalpunktstavla ERTMS;MT 152;1186
Kx;E;2;1399+ 715;0;y;Signalpunktstavla ERTMS;UTFT L202;1706
Kx;E;2;1399+ 875;0;h;Signalpunktstavla ERTMS;INFT 101;1188
Kx-Rsi;E;;1400+ 920;0;h;Signalpunktstavla ERTMS;LT L212;1707
Kx-Rsi;E;;1400+ 920;0;h;Signalpunktstavla ERTMS;LT L221;1708
Kx-Rsi;E;;1403+ 28;0;h;Signalpunktstavla ERTMS;LT L222;1709
Kx-Rsi;E;;1403+132;0;h;Signalpunktstavla ERTMS;LT L211;1710
Rsi;E;1;1404+ 289;0;h;Signalpunktstavla ERTMS;INFT 102;1524
Rsi;E;1;1404+ 394;0;h;Signalpunktstavla ERTMS;UTFT L201;1525
Rsi;E;1;1404+ 673;0;y;Signalpunktstavla ERTMS;MT 151;1526
Rsi;E1;3;1404+ 674;0;h;Signalpunktstavla ERTMS;MT 149;1527
Rsi;E;1;1404+ 773;0;h;Signalpunktstavla ERTMS;MT 141;1528
Rsi;E1;3;1404+ 873;0;y;Signalpunktstavla ERTMS;MT 139;1529
Rsi;E;1;1405+ 422;0;y;Signalpunktstavla ERTMS;MT 142;1530
Rsi;E1;3;1405+ 461;0;y;Signalpunktstavla ERTMS;MT 111;1531
Rsi;E;1;1405+ 529;0;y;Signalpunktstavla ERTMS;MT 152;1532
Rsi;E1;3;1405+ 661;0;h;Signalpunktstavla ERTMS;MT 121;1533
Rsi;E;1;1405+ 715;0;y;Signalpunktstavla ERTMS;UTFT L202;1534
Rsi;E;1;1405+ 815;0;h;Signalpunktstavla ERTMS;INFT 101;1535
Kia;E;2;1406+ 515;0;h;Signalpunktstavla ERTMS;INFT 102;1606
Kia;E;2;1406+ 625;0;h;Signalpunktstavla ERTMS;UTFT L201;1607
Kia;;3;1406+ 884;0;h;Signalpunktstavla ERTMS;MT 159;1608
Kia;E;2;1406+ 884;0;h;Signalpunktstavla ERTMS;MT 161;1610
Kia;;1;1406+ 884;0;y;Signalpunktstavla ERTMS;MT 163;1609
Kia;;4;1406+ 950;0;h;Signalpunktstavla ERTMS;MT 157;1611
Kia;;3;1406+ 984;0;h;Signalpunktstavla ERTMS;MT 149;1613
Kia;E;2;1406+ 984;0;h;Signalpunktstavla ERTMS;MT 151;1614
Kia;;1;1406+ 984;0;y;Signalpunktstavla ERTMS;MT 153;1612
Kia;;5;1406+ 989;0;h;Signalpunktstavla ERTMS;MT 155;1615
Kia;;6;1407+ 68;0;h;Signalpunktstavla ERTMS;MT 143;1616
Kia;;6;1407+ 407;0;y;Signalpunktstavla ERTMS;MT 140;1617
Kia;;5;1407+ 466;0;y;Signalpunktstavla ERTMS;MT 138;1618
Kia;;1;1407+ 627;0;y;Signalpunktstavla ERTMS;MT 150;1619
Kia;E;2;1407+ 633;0;y;Signalpunktstavla ERTMS;MT 152;1620
Kia;;5;1407+ 644;0;y;Signalpunktstavla ERTMS;MT 168;1621
Kia;;3;1407+ 690;0;y;Signalpunktstavla ERTMS;MT 154;1622
Kia;;4;1407+ 724;0;y;Signalpunktstavla ERTMS;MT 166;1623
Kia;;1;1407+ 733;0;y;Signalpunktstavla ERTMS;MT 160;1624
Kia;E;2;1407+ 733;0;y;Signalpunktstavla ERTMS;MT 162;1625
Kia;;3;1407+ 792;0;y;Signalpunktstavla ERTMS;MT 164;1626
Kia;E;2;1408+167;0;y;Signalpunktstavla ERTMS;UTFT L202;1627
Kia;E;2;1408+ 284;0;h;Signalpunktstavla ERTMS;INFT 101;1628
Kia-Pea;E;;1409+ 770;0;y;Signalpunktstavla ERTMS;LT L212;1629
Kia-Pea;E;;1409+ 770;0;y;Signalpunktstavla ERTMS;LT L221;1630
Kia-Pea;E;;1412+ 734;0;y;Signalpunktstavla ERTMS;LT L222;1631
Kia-Pea;E;;1412+ 734;0;V;Signalpunktstavla ERTMS;LT L211;1632
Stk;E;2,1;1322+ 884;1322+ 928;88,3;H,V;Vxl 432;2860002
Stk;;1,0;1323+ 191;1323+ 220;58;V,H;Vxl 424;2860003
Stk;;1,0;1323+ 354;1323+ 383;58;H,V,;Vxl 413;2860001
Stk;E;1,2;1323+ 548;1323+ 603;108,4;V,H,;Vxl 401;2860004
Lin;E;3,2;1335+ 770;1335+ 824;108,4;V,H;Vxl 432;2870001
Lin;;2,1;1335+ 838;1335+ 892;108,4;V,H;Vxl 434;2870002
Lin;;1,0;1335+ 939;1335+ 968;58;H,V;Vxl 426;2870003
Lin;;1,0;1336+ 105;1336+ 139;58;V,H,;Vxl 415;2870004
Lin;;2,1;1336+ 505;1336+ 559;108,4;V,H,;Vxl 403;2870005
Lin;E;2,3;1336+ 760;1336+ 814;108,4;H,V,;Vxl 401;2870006
Håk;E;1,2;1345+ 469;1345+ 523;108,4;H,V;Vxl 432;2880001
Håk;;2,3;1345+ 646;1345+ 675;58;V,H;Vxl 424;2880002
Håk;;2,3;1345+ 824;1345+ 853;58;H,V,;Vxl 413;2880003
Håk;E;1,2;1346+ 138;1346+ 193;108,4;H,V,;Vxl 401;2880004
Har;E;3,2;1357+ 123;1357+ 178;108,4;V,H;Vxl 432;2890002
Har;;2,1;1357+ 546;1357+ 575;58;H,V;Vxl 424;2890003
Har;;2,1;1357+ 717;1357+ 746;58;V,H,;Vxl 413;2890004
Har;E;2,3;1358+  52;1358+ 106;108,4;H,V,;Vxl 401;2890005
Fjå;E;2,1;1370+ 400;1370+ 445;89,2;V,H;Vxl 432;2900001
Fjå;;1,3;1370+ 684;1370+ 713;58;V,H;Vxl 424;2900003
Fjå;;1,3;1370+ 851;1370+ 880;58;H,V,;Vxl 413;2900004
Fjå;E;1,2;1371+  63;1371+ 109;89,2;V,H,;Vxl 401;2900002
Lab;E;3,2;1380+ 144;1380+ 198;108,4;V,H;Vxl 432;2910001
Lab;;2,1;1380+ 213;1380+ 267;108,4;V,H;Vxl 434;2910003
Lab;;0;1380+ 492;;0;;Stoppbock sb5;2910009
Lab;;0,1;1380+ 715;1380+ 748;66,5;V,H,;Vxl 415;2910008
Lab;;1,2;1381+ 220;1381+ 274;108,4;V,H,;Vxl 403;2910004
Lab;E;2,3;1381+ 321;1381+ 375;108,4;V,H,;Vxl 401;2910002
Gy;E;1,2;1391+  67;1391+ 111;89,2;V,H;Vxl 432;2920001
Gy;;2,3;1391+ 401;1391+ 430;58;H,V;Vxl 424;2920002
Gy;;2,3;1391+ 571;1391+ 601;58;V,H,;Vxl 413;2920003
Gy;E;1,2;1391+ 730;1391+ 776;92,9;V,H,;Vxl 401;2920004
Kx;E;2,1;1398+ 775;1398+ 820;89,2;V,H;Vxl 432;2930001
Kx;;1,3;1398+ 927;1398+ 956;58;H,V;Vxl 424;2930002
Kx;;1,3;1399+  89;1399+ 118;58;V,H,;Vxl 413;2930003
Kx;E;2,1;1399+ 438;1399+ 486;89,2;V,H,;Vxl 401;2930004
Rsi;E,E1;1,3;1404+ 588;1404+ 642;108,4;H,V;Vxl 432;2700001
Rsi;;Omf 4,Omf 5;1404+ 645;1405+ 651;58;V,H;Vxl 4b;2700020
Rsi;;Omf 4;1404+ 800;;0;;Stoppbock 783;2700031
Rsi;E2,E;2,1;1405+ 567;1405+ 622;108,4;V,H,;Vxl 401;2700026
Kia;E;2,3;1406+ 682;1406+ 737;108,4;H,V;Vxl 472;19500015
Kia;;7;1406+ 700;;0;;Stoppbock sb765;19500034
Kia;;6a;1406+ 700;;0;;Stoppbock sb759;19500059
Kia;;Lastsp1;1406+ 721;;0;;Stoppbock sb769;19500027
Kia;E;2,1;1406+ 758;1406+ 812;108,4;H,V;Vxl 462;19500067
Kia;;3,4;1406+ 807;1406+ 840;66,5;V,H;Vxl 474;19500016
Kia;;Lastsp1,4;1406+ 853;1406+ 882;58;V,H,;Vxl 475;19500017
Kia;;4,5;1406+ 889;1406+ 918;58;V,H;Vxl 478;19500018
Kia;;5,6;1406+ 930;1406+ 959;58;V,H;Vxl 480;19500054
Kia;;6a,6;1407+  28;1407+  57;58;V,H,;Vxl 481;19500030
Kia;;6,7;1407+ 438;1407+ 468;58;H,V,;Vxl 423;19500035
Kia;;5,6;1407+ 492;1407+ 522;58;H,V,;Vxl 421;19500042
Kia;;lastspår;1407+ 585;;0;;Stoppbock sb123;19500047
Kia;;5,lastspår;1407+ 676;1407+ 706;58;H,V,;Vxl 407;19500043
Kia;;4,5;1407+ 757;1407+ 786;58;H,V,;Vxl 405;19500021
Kia;E;2,1;1407+ 773;1407+ 828;108,4;V,H,;Vxl 441;19500066
Kia;;4,utdr.n;1407+ 796;1407+ 825;58;H,V;Vxl 404;19500019
Kia;;3,4;1407+ 834;1407+ 868;66,5;H,V,;Vxl 403;19500014
Kia;;utdr.n,Lok.u.sp;1407+ 863;1407+ 892;58;V,H;Vxl 412;19500020
Kia;;utdr.n,upst.sp;1407+ 898;1407+ 927;58;V,H;Vxl 414;19500061
Kia;E;3,2;1407+ 936;1407+ 990;108,4;V,H,;Vxl 401;19500013
Kia;;Lok.u.sp;1408+   1;;0;;Stoppbock sb758;19500062
Kia;;utdr.n,upst.sp;1408+ 111;1408+ 140;58;H,V,;Vxl 415;19500063
Kia;;utdr.n;1408+ 284;;0;;Stoppbock sb773;19500065

`;