set -euo pipefail

DEFAULT_REGION="eu-central-1"
read -erp "AWS region: " -i "$DEFAULT_REGION" REGION
REGION="${REGION:-$DEFAULT_REGION}"

# name|secret(0/1)
PARAMS=(
  "dot-bot_port|0"
  "dot-bot_twitch-channel|0"
  "dot-bot_twitch-oauth-client-id|0"
  "dot-bot_twitch-oauth-client-secret|1"
  "dot-bot_twitch-oauth-redirect-uri|0"
  "dot-bot_twitch-prefix|0"
)

command -v aws >/dev/null || { echo "aws CLI not found" >&2; exit 1; }

# Pending changes, collected first and applied at the end
declare -a names=() values=() secrets=()

for entry in "${PARAMS[@]}"; do
  IFS='|' read -r name secret <<< "$entry"

  current="$(aws ssm get-parameter --name "$name" --with-decryption \
    --query 'Parameter.Value' --output text --region "$REGION" 2>/dev/null || true)"

  if [[ "$secret" == "1" ]]; then
    read -rsp "$name [********] (Enter to keep): " value; echo
  else
    read -erp "$name [$current]: " -i "$current" value
  fi

  if [[ -n "$value" && "$value" != "$current" ]]; then
    names+=("$name"); values+=("$value"); secrets+=("$secret")
  fi
done

if (( ${#names[@]} == 0 )); then
  echo "No changes."
  exit 0
fi

echo "Changes to apply in $REGION:"
for i in "${!names[@]}"; do
  if [[ "${secrets[$i]}" == "1" ]]; then
    echo "  ${names[$i]} = ********"
  else
    echo "  ${names[$i]} = ${values[$i]}"
  fi
done
echo

read -rp "Apply these changes? [y/N]: " confirm
[[ "$confirm" =~ ^[Yy]$ ]] || { echo "Aborted, nothing changed."; exit 0; }

for i in "${!names[@]}"; do
  aws ssm put-parameter --name "${names[$i]}" --value "${values[$i]}" --overwrite \
    --region "$REGION" >/dev/null
  echo "  updated ${names[$i]}"
done

echo "Done. ${#names[@]} parameter(s) updated."