-- OIDC RP-Initiated Logout 用に post_logout_redirect_uris をクライアントに追加
-- 仕様: https://openid.net/specs/openid-connect-rpinitiated-1_0.html
--   end_session_endpoint は post_logout_redirect_uri パラメータを受け取り、
--   登録済みURI集合に完全一致する場合のみリダイレクトを返す

ALTER TABLE ha_oauth_clients
  ADD COLUMN IF NOT EXISTS post_logout_redirect_uris TEXT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN ha_oauth_clients.post_logout_redirect_uris IS
  'OIDC RP-Initiated Logout の post_logout_redirect_uri 完全一致候補。空配列ならログアウト後リダイレクト不可（end-sessionは確認ページで終了）';
